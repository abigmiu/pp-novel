# 付费体系 M3/M4 需求文档（对账/风控/监控 + 真实支付/分账/优惠券/提现）

## 1. 背景与目标
- 面向：读者、作者、运营、财务/风控。现有站内钱包已支持模拟充值、章节购买、调账。
- M3 目标（第 11/12 点）：补齐资金安全与可观测能力——每日对账汇总、充值风控/限流、可观测与告警。
- M4 目标（第 12 点）：接入真实支付渠道，补齐收益分账、提现链路，并提供优惠券/限免活动能力。
- 价值：降低资金差错风险，支撑财务核对；减少恶意/误操作风险；让充值/消费具备真实货币闭环。

## 2. 范围与不在范围
- 范围：钱包充值/消费全链路的对账、风控、监控；真实支付渠道接入；作者收益分账；提现申请与审核；优惠券与限免活动。
- 不在范围：复杂风控模型（机器学习）、多币种结算、税务处理、发票开具、大规模消息总线治理（仅埋点）。

## 3. 角色与主要场景
- 读者：充值、消费、使用优惠券、参与限免活动、提现申请（若有退款/返还余额）。
- 作者：查看收益、申请提现（收益结算后）。
- 运营：配置限流阈值、手工调账、审核提现、拉取对账报表、配置优惠券与限免。
- 财务/风控：查看每日对账汇总、监控失败告警、复核风险事件。

## 4. 用户故事（节选）
- 读者想在 1 天内累计充值 300 元，超过阈值被阻断并提示联系客服。
- 运营想每天早上下载前一日的充值/消费汇总并核对异常差额。
- 研发收到监控告警，能定位是支付回调延迟、还是 Redis 限流误伤。
- 读者使用 5 元满减券购买章节，看到优惠抵扣明细与最终扣款。
- 作者希望月末按消费分成获得收益，发起提现并经运营审核后到账。
- 财务希望当日真实支付渠道流水与站内账务无差异，异常时能复核 requestId/orderNo。

## 5. 功能需求
### 5.1 对账汇总（M3）
- 生成日汇总：按自然日汇总充值、消费、调账的笔数/金额，数据源为 `wallet_txn`。
- 渠道维度：真实支付上线后，汇总需分渠道（MOCK/ALIPAY/WX/APPLEPAY...）。
- 异常检测：当日站内充值总额与支付渠道对账文件差异超过阈值时标记异常并告警。
- 下载/查看：运营可在控制台导出 CSV/JSON；提供 `GET /api/pay/admin/settle/daily`。

### 5.2 限流与风控（M3）
- 充值频率/额度限制：可配置日累计金额、单笔上限、分钟级频率。
- 重复请求防重：继续使用 requestId 幂等，新增 Redis 防重窗口防止暴力刷。
- 黑白名单：可配置用户、IP 的拒绝/放行名单。
- 事件记录：被拦截的请求写入风控日志表，供运营查询。

### 5.3 监控与告警（M3）
- 关键指标：充值/消费成功率、延迟 P95、限流命中次数、对账差异数、回调失败数。
- 健康检查：支付相关接口暴露 Actuator/Prometheus 指标，异常阈值触发告警。
- 日志追踪：所有订单链路携带 traceId/orderNo/requestId，便于串联查询。

### 5.4 真实支付接入（M4）
- 支付渠道：首期接入 1~2 个（三方 SDK 或网关），保留 MOCK 渠道。
- 支付状态机：PENDING → SUCCESS/FAILED/CLOSED；支持异步回调更新。
- 回调校验：签名校验、金额一致性校验、防重处理（requestId/orderNo）。
- 退款（可选占位）：如支付失败或关闭时，订单状态一致，资金不入账或回退。

### 5.5 收益分账（M4）
- 规则：消费金额按配置比例分成（平台/作者），预留出版社/渠道方比例。
- 结算周期：按日/周/月汇总作者收益，生成结算单，写入分账流水。
- 数据可视：作者可查看收益明细、结算单；运营可调整分成比例并生效时间。

### 5.6 提现（M4）
- 流程：作者（或用户余额）发起提现 → 创建提现单 → 运营审核 → 支付渠道代付或人工线下处理 → 回写状态与流水。
- 限制：最低提现金额、手续费、单日次数；异常/退票需支持失败状态。
- 资金安全：提现前校验可提现余额 = 结算已确认收益 - 已提现。

### 5.7 优惠券与限免活动（M4）
- 优惠券类型：满减、直减、折扣；可配置有效期、适用范围（作品/章节/全站）、叠加规则。
- 领券与核销：用户领券/发放、下单时选择优惠，核销写入消费单与流水备注。
- 限免活动：按时间段/章节配置价格=0，优先级高于普通价格。
- 前端展示：返回可用优惠券列表、结算时的优惠明细。

## 6. 接口需求（新增/调整）
- 对账：`GET /api/pay/admin/settle/daily?date=2025-01-01&channel=ALL` 返回汇总与差异标记。
- 风控配置：`POST /api/pay/admin/risk/config` 设置额度/频率/名单；`GET /api/pay/admin/risk/logs` 查看拦截记录。
- 监控：Actuator/Prometheus 暴露 `/actuator/metrics/pay.*`；日志链路包含 traceId。
- 支付下单：`POST /api/pay/recharge` 新增 `channel`，返回支付参数（或跳转链接）与 orderNo。
- 支付回调：`POST /api/pay/callback/{channel}` 接收第三方回调，返回 success/failed。
- 优惠券：`GET /api/pay/coupons/available`，`POST /api/pay/coupons/{couponId}/use`。
- 分账/结算：`GET /api/pay/admin/settlements?cycle=monthly`；`POST /api/pay/admin/settlements/{id}/confirm`。
- 提现：`POST /api/pay/payouts` 创建提现单；`POST /api/pay/admin/payouts/{id}/review` 审核；`GET /api/pay/payouts` 查询状态。

## 7. 数据需求与表（新增/调整）
- `settle_daily`：id, date, channel, recharge_amount, consume_amount, adjust_amount, order_count, diff_amount, status, created_at。
- `risk_event`：id, user_id, ip, reason, rule_code, amount, request_id, created_at。
- `payment_channel_order`（或在 recharge_order 扩展）：channel, channel_trade_no, notify_payload, notify_status。
- `revenue_share`：id, author_id, cycle, gross_amount, share_amount, platform_amount, status, remark, created_at。
- `payout`：id, user_id/author_id, amount, fee, status(PENDING/REVIEWING/SUCCESS/FAILED), channel, request_id, created_at, updated_at。
- `coupon` / `coupon_user` / `coupon_rule`：券模板、领券、核销状态字段；消费单增加 `coupon_id`、`discount_amount`。
- `free_activity`：id, scope(work/chapter), start_at, end_at, operator, status。

## 8. 业务规则与状态
- 支付：orderNo 唯一；回调按 requestId 幂等；金额与签名不符则拒绝并告警。
- 分账：结算单一旦确认不可修改；若需调整，新增补差或冲正流水。
- 提现：审核通过后才触发代付；失败需写失败原因并回滚可提现余额。
- 优惠：优惠金额不能超过商品价格；优先用限免，其次最优券；核销失败则订单失败。

## 9. 非功能与合规
- 金额精度：BigDecimal / DECIMAL(18,2)；所有金额字段保持 2 位小数。
- 审计：记录操作人、IP、requestId、orderNo；运营审核动作需留痕。
- 性能：支付下单/回调延迟 < 1s，限流判定 < 20ms；对账任务在 T+1 3 点前完成。
- 可用性：支付/回调接口 SLA 99.9%；限流配置热更新或短时间生效。
- 安全：回调需白名单 IP 与签名；管理接口需角色/权限；防重放（时间戳 + nonce + 签名）。

## 10. 验收标准（按模块）
- 对账：给定一组 wallet_txn 数据，可生成正确汇总；与渠道账单差异>阈值时触发告警。
- 风控：配置日限额 300，用户累计 301 元充值被拒；黑名单用户请求被拦截且有日志。
- 监控：压测时能看到 P95 延迟变化；关闭支付回调服务时有告警。
- 真实支付：下单返回渠道参数，模拟回调后订单状态变为 SUCCESS 且入账；重复回调不重复入账。
- 分账：消费 100 元，作者分成 70 元写入结算单；确认后不可修改。
- 提现：低于最小提现额度被拒；审核通过后状态变 SUCCESS，余额扣减，流水记录。
- 优惠券/限免：限免期内购买价格为 0；使用满减券扣减正确，消费单记录 couponId 与优惠额。

