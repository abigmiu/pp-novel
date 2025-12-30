# pp-novel/server 知识缺口与落地清单（对标国内小公司上线要求）

> 目标：把当前项目从“能跑”提升到“能上线、可维护、可扩展、可交接”。
>
> 范围：后端（`web` + `common`）与必要工程化配套。

## 快速画像（用于对标）

- 技术栈：Spring Boot 3.x、Java 21、MyBatis-Plus、MySQL、Redis、RabbitMQ、Elasticsearch、Sa-Token、springdoc-openapi（Swagger UI）。
- 现状特征：功能模块齐（登录/短故事/小说/支付/通知/邮件/搜索），但“安全、可靠性、工程化交付”短板明显。

---

## P0（必须补齐，否则不建议上线）

### 1) 配置/密钥治理（Secrets Management）

- [ ] 清理仓库中出现的明文口令/账号/Key（包含 `application-*.yml`、日志、SQL dump 等）。
- [ ] 统一使用分环境配置：`application.yml` 只放默认值与开关；敏感信息只从环境变量/密钥系统注入。
- [ ] 增加 `.gitignore`：至少忽略 `**/target/`、`.DS_Store`、`.idea/`、`server/logs/`、`persistent/*.rdb`、本地配置文件（如 `application-local.yml`）。
- [ ] 加入“提交前扫描”：pre-commit 或 CI 阶段做 secret 扫描（如 gitleaks），阻断泄露。

**需要掌握的知识点**
- Spring Boot 配置优先级、Profile 管理、外部化配置（env/command line/config tree）。
- 密钥生命周期：生成、存储、轮换、最小权限、审计。

### 2) 账号与密码安全（Authentication / Password Storage）

- [ ] 替换 MD5 密码哈希为强哈希：BCrypt/Argon2（带随机盐、可调成本）。
- [ ] 修复“static 字段注入配置”这类用法：避免 `@Value` 注入 static；改为 `@ConfigurationProperties` 或实例 Bean。
- [ ] 统一登录态与鉴权：明确哪些接口必须登录、哪些 `@SaIgnore`，并补齐角色/权限模型（读者/作者/管理员）。
- [ ] 增加风控：登录/验证码接口限流、失败次数限制、验证码重放保护。

**需要掌握的知识点**
- 密码学基础：哈希 vs 加密、盐与成本、撞库防护。
- Sa-Token 使用边界、会话与并发登录策略、权限注解设计。

### 3) CORS 与 Web 安全基础

- [ ] 修正 CORS：禁止“`Allow-Credentials=true` + `*` 允许所有来源”的组合；按域名白名单配置。
- [ ] 增加安全响应头（至少）：`X-Content-Type-Options`、`X-Frame-Options`/CSP、`Referrer-Policy`（视前端需求）。
- [ ] 对外接口做输入校验与输出约束：避免把异常堆栈/内部信息泄露给客户端。

**需要掌握的知识点**
- 浏览器同源/CORS 规则、cookie/authorization header 的差异与风险。
- 常见 Web 漏洞：CSRF/XSS/SSRF/IDOR 的基本判断与防护思路。

### 4) 可靠性：MQ/Redis/事务的一致性与幂等

- [ ] MQ 消费：严格定义 ack 时机（成功才 ack；失败按可恢复/不可恢复区分 nack/reject），并对“后置动作”做幂等。
- [ ] Redis：避免 `get` 结果为空直接做算术；计数类用 `INCR` 或 Lua 保证原子性。
- [ ] 事务边界：关键资金/购买/发放权益链路，保证“写库与权益发放”的一致性（至少做到可重试 + 幂等）。
- [ ] 为幂等设计建立统一规范：requestId、唯一索引、重复请求返回一致结果。

**需要掌握的知识点**
- 事务隔离与锁（含 `SELECT ... FOR UPDATE` 的使用边界）。
- MQ 消费语义：at-least-once/at-most-once/exactly-once（工程上通常追求“至少一次 + 幂等”）。

### 5) 文件上传与对象存储安全

- [ ] 预签名上传：把对象 key 与业务对象绑定（例如 storyId + userId），并记录上传凭证/回调确认，防止任意写入。
- [ ] 完整校验：Content-Type 白名单、大小上限、文件名与路径规范、可选的内容嗅探（magic bytes）。
- [ ] 资源释放：使用 try-with-resources 或显式 close（如 presigner）。

**需要掌握的知识点**
- 预签名 URL 的安全模型：谁能拿到、能干什么、有效期、对象 key 权限边界。
- 上传链路的“最终一致”：前端上传成功 != 业务可用，需要服务端确认。

---

## P1（强烈建议补齐：降低返工与线上事故）

### 6) 统一错误码/异常体系与日志规范

- [ ] 定义错误码规范：HTTP 状态 + 业务 code（或单一 code 体系），并统一返回结构（现在有 `Result` + Advice，但异常与日志体系不完整）。
- [ ] 异常处理：替换 `printStackTrace`，统一结构化日志（traceId、userId、uri、耗时、errorCode）。
- [ ] 补齐请求日志策略：敏感字段脱敏（密码、token、邮箱等），避免日志泄露。

### 7) 可观测性（可定位、可度量）

- [ ] Actuator：开启 health/metrics，并加鉴权（不要裸露在公网）。
- [ ] 指标：请求耗时、错误率、MQ 堆积、Redis/DB 连接池、慢查询。
- [ ] 链路追踪：traceId 贯通 Web -> MQ -> DB/Redis，并能在日志中检索。

### 8) 数据库工程化

- [ ] 引入迁移工具：Flyway/Liquibase，替代手动 SQL dump（`persistent/pp_novel.sql` 只能做初始化，不适合演进）。
- [ ] 强化约束：唯一索引、外键策略、字段非空、默认值、软删除一致性。
- [ ] 慢查询治理：关键接口的 SQL 审核、分页与索引设计。

### 9) 单元测试/集成测试与回归策略

- [ ] 最少覆盖：登录/注册、充值/购买章节、短故事创建/草稿、通知/邮件消费、搜索接口（每类 1~3 个关键用例）。
- [ ] 引入 Testcontainers（可选）：让 MySQL/Redis/RabbitMQ/ES 的集成测试可在 CI 中稳定跑。

---

## P2（加分项：更像“成熟小公司”的代码库）

### 10) API 设计与文档化

- [ ] 接口命名与资源建模统一（REST 风格：资源/子资源/动作），避免路径风格混用。
- [ ] Swagger：补齐响应结构、错误码说明、鉴权说明、示例请求与字段约束。
- [ ] 版本化：`/api/v1` 或 header version，为未来迭代留口子。

### 11) 架构与模块边界

- [ ] 分层更清晰：Controller 只做协议层；Service 聚合业务；Repository/Mapper 负责数据访问；避免业务散落在 Controller/Consumer。
- [ ] 领域对象与 DTO 分离：减少 entity 直接出入参，控制字段暴露。
- [ ] 统一“常量/枚举/字典”管理：避免魔法字符串（type、status、bizScene 等）。

### 12) CI/CD 与可交付运行环境

- [ ] 增加 README：本地启动、依赖（MySQL/Redis/RabbitMQ/ES）、初始化 SQL、常用命令。
- [ ] 增加 `docker-compose.yml`：一键拉起依赖与服务（本地/测试环境）。
- [ ] CI：`mvn -q -DskipTests=false test` + 基本静态检查（Checkstyle/SpotBugs 可选）。

---

## 建议的落地节奏（最小可上线）

- 第 1 周：P0 全部完成（尤其是 secrets、密码哈希、CORS、MQ/Redis 幂等与健壮性）。
- 第 2 周：P1（错误码/日志/actuator/迁移/最小测试）。
- 第 3~4 周：P2（文档、CI/CD、架构边界清理）。

---

## 验收标准（Definition of Done）

- [ ] 仓库无明文密钥，且提交时能被扫描拦截。
- [ ] 关键链路（注册/登录/充值/购买/发放权益）具备幂等与可重试能力。
- [ ] 线上可定位：任一请求能通过 traceId 追到日志、耗时与异常原因。
- [ ] 有最小自动化回归：至少覆盖关键业务 happy path + 1~2 个异常路径。

