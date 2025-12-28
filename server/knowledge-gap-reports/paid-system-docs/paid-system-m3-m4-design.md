# 付费体系 M3/M4 技术设计（对账/风控/监控 + 真实支付/分账/优惠券/提现）

## 1. 设计目标与范围
- 在现有 Spring Boot + MyBatis-Plus 钱包能力上，补齐 M3（对账汇总、限流/风控、监控告警）与 M4（真实支付、分账、提现、优惠券/限免）。
- 设计原则：幂等优先（requestId/orderNo）、单向流水不可变、余额与流水同事务；对 Vue 端暴露稳定的 API 形态，兼容 MOCK 与真实支付。

## 2. 架构概览
- `web` 模块：Controller + DTO + 校验；暴露支付下单、回调、限流配置、对账查询、优惠券、提现等接口。
- `common` 模块：实体/Mapper/Service，包括 `wallet`、`wallet_txn`、`recharge_order`、`consume_order`、`chapter_access` 等；新增风险、对账、分账、优惠券等实体。
- 支撑组件：Redis（幂等防重、限流计数）、可选 MQ（消费成功/支付回调事件）、调度（对账汇总、结算、过期清理）、Actuator/Prometheus（监控指标）。
- 支付网关抽象：`PaymentGateway` 接口 + 具体适配器（Mock/Alipay/WX...），统一下单、回调解析、签名验真。

## 3. 数据模型（新增/扩展）
- `recharge_order` 扩展：`channel`(MOCK/ALIPAY/WX)、`channel_order_no`、`pay_params`(下发前端)、`callback_status`、`callback_at`、`notify_payload`。
- `wallet_txn` 扩展：`channel`、`coupon_id`、`discount_amount`、`extra`(JSON)；仍保持仅插入。
- `settle_daily`：`id`, `date`, `channel`, `recharge_amount`, `consume_amount`, `adjust_amount`, `order_count`, `diff_amount`, `status`(NORMAL/DIFF), `remark`, `created_at`.
- `risk_event`：`id`, `user_id`, `ip`, `rule_code`(DAILY_LIMIT/SINGLE_LIMIT/FREQ/BLACKLIST), `amount`, `request_id`, `context`, `created_at`.
- `coupon_rule` / `coupon` / `coupon_user`：模板、券实例、用户券；字段包含类型、阈值、折扣、适用范围、有效期、状态。
- `free_activity`：活动维度与时间窗口；用于定价时覆盖章节价格。
- `revenue_share`：`id`, `author_id`, `cycle`, `gross_amount`, `share_amount`, `platform_amount`, `status`(PENDING/CONFIRMED/ADJUSTED), `created_at`.
- `payout`：`id`, `user_id`, `amount`, `fee`, `channel`, `status`(PENDING/REVIEWING/SUCCESS/FAILED), `request_id`, `operator`, `remark`, `created_at`, `updated_at`.

## 4. 状态机与幂等
- 充值/支付：`PENDING` → (`SUCCESS` | `FAILED` | `CLOSED`)；回调进入时按 `orderNo + requestId` 幂等；金额、签名不符直接 `FAILED` 并告警。
- 提现：`PENDING` → `REVIEWING` → (`SUCCESS` | `FAILED`)；失败时释放可提现余额。
- 优惠券：`UNUSED` → `USED` | `EXPIRED`；核销成功后写消费单与流水；事务内扣减。
- 分账结算：`PENDING` → `CONFIRMED`；如需修正使用补差结算单而非修改原记录。

## 5. 关键流程设计
### 5.1 支付下单与回调
1) 前端调用 `POST /api/pay/recharge`，请求体含 `amount`, `channel`, `requestId`。  
2) Service：校验限流/风控 → 创建 `recharge_order(PENDING)` → 调用 `PaymentGateway.createPayment` 得到前端支付参数（或直接成功的 MOCK）→ 返回 `orderNo + payParams`。  
3) 回调 `POST /api/pay/callback/{channel}`：验签 → 查订单 → 幂等检查 → 校验金额一致 → 事务内：更新订单状态、插入 `wallet_txn`、增余额 → 返回渠道期望的成功响应。  
4) 双写一致性：余额更新与流水写入同事务；回调幂等保证不重复入账。

### 5.2 对账汇总（调度任务）
1) 每日 02:00 触发（`@Scheduled`）：拉取前一日 `wallet_txn` 按类型/渠道聚合 → 写入 `settle_daily`。  
2) 若存在真实支付渠道：读取渠道对账文件/API → 对比本地充值成功金额/笔数 → 计算差额与原因（缺少回调、重复、金额不符）。  
3) 结果标记 `status=NORMAL/DIFF`，差异>阈值推送告警（邮件/企业微信）；允许运营手工备注。  
4) 提供 API 导出 CSV：利用流式写出避免内存高占用。

### 5.3 限流与风控
- 日累计/单笔限制：使用 Redis 计数器 key=`pay:limit:{userId}:{date}`；Lua 脚本原子检查 + 自增。超限抛业务码并写 `risk_event`。
- 高频点击：滑动窗口（Redis ZSet，时间戳 score）；窗口内超过阈值则拦截。
- 黑名单：`risk:blacklist:user:{userId}` / `risk:blacklist:ip:{ip}` 放行/拒绝开关；配置存 DB + 缓存。
- 防重：`SETNX pay:req:{requestId}`，过期 30 min；重复请求直接返回已处理结果。

### 5.4 监控与告警
- 指标：  
  - `pay_recharge_success_total`/`failed_total`（labels: channel）  
  - `pay_recharge_latency_ms_bucket`、`pay_consume_latency_ms_bucket`  
  - `pay_risk_block_total`（labels: rule_code）  
  - `pay_reconcile_diff_total`  
- 日志：使用 MDC 写入 `traceId`, `orderNo`, `requestId`, `userId`；回调失败 WARN/ERROR。
- 健康：`/actuator/health`、`/actuator/metrics` 暴露；告警通过现有 APM/监控平台配置阈值。

### 5.5 优惠券与限免定价
1) 查询可用优惠券 `coupon_user` + 适用范围过滤。  
2) 计算章节价格：先应用限免活动（价格=0），否则基础价；再按优惠券规则计算 `discountAmount`，确保 >=0。  
3) 下单事务内：锁定/核销优惠券状态为 `USED`，写入 `consume_order.discount_amount` 与 `wallet_txn` 备注。  
4) 幂等：相同 `requestId` 或 (userId, chapterId, bizType) 重放直接返回已授权。

### 5.6 分账与收益结算
- 消费成功事件（同步或 MQ）写入中间表 `revenue_share` 待结算金额。  
- 调度任务按周期聚合作者收益，生成结算单；状态 `PENDING` → 运营确认 → `CONFIRMED`。  
- 结算确认后将金额计入作者可提现余额（可复用 `wallet` 或单独 `settle_wallet`）。  
- 若需要调整，创建补差结算单，避免修改历史记录。

### 5.7 提现流程
1) 前端 `POST /api/pay/payouts`：校验可提现余额、限额、频次 → 创建 `payout(PENDING)` 并冻结可提现余额。  
2) 运营审核接口修改为 `REVIEWING` → `SUCCESS/FAILED`；成功时插入 `wallet_txn`(OUT)、减少余额；失败释放冻结额并记录原因。  
3) 若对接渠道代付，沿用 `PaymentGateway` 的 `payout`/`payoutCallback`。

## 6. 接口与 DTO（示例）
- `POST /api/pay/recharge` request `{amount, channel, requestId}` → response `{orderNo, payParams?, balance}`。  
- `POST /api/pay/callback/{channel}` body 为渠道回调 payload；返回渠道规定字符串（如 "success"）。  
- `GET /api/pay/admin/settle/daily?date=&channel=` → 返回汇总表格与差异标志。  
- `POST /api/pay/admin/risk/config` body `{dailyLimit, singleLimit, freqLimit, blacklistUsers, blacklistIps}`。  
- `POST /api/pay/coupons/{couponId}/use` body `{orderNo?, requestId}` → 返回优惠后金额与订单状态。  
- `POST /api/pay/payouts` body `{amount, requestId}`；`POST /api/pay/admin/payouts/{id}/review` body `{approve, reason}`。

## 7. 模块与类建议（包名示例）
- `service.pay.PaymentGateway` 接口 + `MockGateway`, `AlipayGateway`, `WxGateway` 实现；`PaymentCallbackService` 统一处理回调。
- `service.risk.RiskService`：封装 Redis 限流、黑名单检查；`RiskRuleConfig` 配置类。
- `service.settle.SettlementJob`：对账调度；`SettlementService` 导出 CSV。
- `service.coupon.CouponService`：查询/核销；`PricingService`：整合限免与券计算。
- `service.share.RevenueShareService`：分账聚合；`PayoutService`：提现与冻结。
- DTO：`RechargeRequest`, `RechargeResponse`, `CouponUseRequest`, `SettleDailyResponse`, `PayoutRequest` 等。

## 8. 事务与并发控制
- 统一使用 `@Transactional` 包裹：写订单/流水 → 更新余额/冻结 → 业务表（授权/券核销）。  
- 余额更新采用行锁或乐观锁版本号；条件更新 `SET balance = balance - ? WHERE user_id = ? AND balance >= ?`。  
- Redis 防重/限流在事务外先行；若需强一致可使用分布式锁包裹消费流程。  
- 回调与前端查询分开：回调更改状态，前端轮询或长轮询获取最新状态。

## 9. 配置与开关
- `pay.enabled`, `pay.channel.mock.enabled`, `pay.channel.alipay.app-id/key`, `pay.limit.daily`, `pay.limit.single`, `pay.limit.freq`。  
- `pay.settle.diff-threshold`, `pay.monitor.alert-threshold`, `pay.coupon.enabled`, `pay.free-activity.enabled`。  
- 配置支持 `application-*.yml` + 可选数据库配置表；变更后刷新生效（结合 Spring Cloud Context 或自定义配置拉取）。

## 10. 监控、日志与告警落地
- 指标埋点在 Service 层关键路径；使用 Micrometer + Actuator 导出到 Prometheus。  
- 日志：分级 INFO（成功）、WARN（业务异常/限流）、ERROR（回调验签失败/事务异常）。  
- 告警：依赖现有监控平台，配置异常率/回调失败率/对账差异/Redis 连接失败阈值。

## 11. 测试与验收策略
- 单元测试：金额计算（BigDecimal）、优惠券叠加、限流规则脚本。  
- 集成测试：模拟支付回调幂等、并发购买串行扣款、对账任务聚合结果。  
- 接口联调：前端调用支付下单 → 渠道沙箱回调 → 前端轮询订单状态。  
- 压测：充值/回调 QPS 下的延迟与成功率；限流命中率；对账任务在大数据量下的耗时。

## 12. 发布与迁移
- DDL：新增/扩展表字段，先上线兼容版本（允许 null），再发布代码使用新字段。  
- 配置：先启用 MOCK 渠道，待真实渠道验签通过再放量；限流阈值先宽后紧。  
- 回滚预案：保留 MOCK 渠道作为兜底；若真实支付异常，开关关闭真实渠道/分账/提现。

## 13. 前端（Vue）对接要点
- 下单接口返回 `payParams`（如调起 SDK 的参数或跳转链接）；回调异步，前端需轮询 `orderNo` 状态。  
- 错误码：区分限流（429/业务码）、余额不足（402）、支付未完成（202）、优惠券不可用等。  
- 展示明细：返回字段包含 `discountAmount`, `couponId`, `channel`, `status`, `reason`，便于在 UI 显示抵扣和状态。  
- 对账/结算导出接口为后台管理使用，可提供文件下载链接或直接流式下载。

