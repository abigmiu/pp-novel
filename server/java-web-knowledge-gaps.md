# Java Web 未覆盖知识点一览

> 基于当前 `server` 模块的依赖（server/web/pom.xml:33-111）与核心代码（如 server/web/src/main/java/org/ppnovel/web/service/**）梳理，下面列出尚未触及或只实现了极简版本的 Java Web 关键知识点，便于后续针对性学习。

## 1. 事务管理与一致性
- **现状**：例如 `AuthService.register` 同时写入用户、作者统计与 Redis，但方法上没有 `@Transactional`（server/web/src/main/java/org/ppnovel/web/service/auth/AuthService.java:72-123），全局搜索也没有出现 `@Transactional`。
- **可学方向**：Spring 事务传播、回滚策略、声明式与编程式事务、分布式事务 / TCC。

## 2. AOP / 切面编程
- **现状**：代码库没有任何 `@Aspect` 或 AOP 配置，交叉关注点（接口日志、性能统计、埋点）全部写在业务类中，可维护性受限。
- **可学方向**：Spring AOP、AspectJ、通过切面统一做日志、审计、接口耗时统计、参数脱敏等。

## 3. 消息队列与事件驱动
- **现状**：依赖列表仅包含 Web、MyBatis-Plus、Redis、邮件、S3 等（server/web/pom.xml:33-111），没有 RabbitMQ/Kafka/RocketMQ 等消息组件，像邮件验证码、阅读统计都以同步方式执行。
- **可学方向**：基于 MQ 的异步解耦、可靠消息、延迟消息、大量写入的削峰填谷。

## 4. 细粒度权限与角色模型
- **现状**：Sa-Token 只做了全局登录拦截（server/web/src/main/java/org/ppnovel/web/configuration/SaTokenConfigure.java:13-21），项目中也没有 `@SaCheckRole`/`@SaCheckPermission` 等注解（`rg -n "@SaCheck" server` 无结果），因此还未涉及 RBAC、资源级权限或多端授权流程。
- **可学方向**：角色/权限表设计、基于注解或拦截器的权限校验、SaaS 下的租户/数据隔离、OAuth2 / OpenID Connect。

## 5. 自动化测试体系
- **现状**：`spring-boot-starter-test` 已加入依赖（server/web/pom.xml:39-43），但仓库没有 `src/test/java` 目录（`find server -path '*src/test*' -type d` 无结果），缺少单元测试、Mock 与集成测试。
- **可学方向**：JUnit 5、Mockito、Spring Boot Test、基于 Testcontainers 的集成测试、契约测试。

## 6. 数据库版本管理
- **现状**：数据库结构通过手工 SQL 导出维护在 `server/persistent/pp_novel.sql`，项目依赖中没有 Flyway/Liquibase 等迁移工具，因此无法自动回滚或按环境升级。
- **可学方向**：引入 Flyway/Liquibase 版本化脚本、在 CI 中自动执行迁移、为不同环境拆分数据脚本。

## 7. 运维监控与可观测性
- **现状**：`server/web/pom.xml:33-111` 未包含 `spring-boot-starter-actuator`，`application*.yml` 也没有 `management.*` 配置（server/web/src/main/resources/application.yml:1-18），缺少健康检查、指标、链路追踪等知识点。
- **可学方向**：Spring Boot Actuator、Micrometer + Prometheus/Grafana、Zipkin/SkyWalking 链路追踪、日志标准化。

## 8. 容器化与部署自动化
- **现状**：仓库中没有 Dockerfile 或 Compose 文件（`find . -name 'Dockerfile*'` 无结果），目前仅能在本地直接运行，尚未覆盖镜像打包、环境变量注入等部署能力。
- **可学方向**：多阶段 Docker 镜像、Compose/K8s 部署、配置中心/环境隔离、CI/CD 流程。

## 9. 定时 / 批量任务
- **现状**：项目中没有 `@Scheduled` / `SchedulingConfigurer` 的使用（`rg -n "@Scheduled" server/web/src/main/java` 无结果），因此尚未涉及定时同步、报表、批量清理等常见场景。
- **可学方向**：Spring Scheduling、Quartz、分布式任务调度（xxl-job）、幂等与失败补偿策略。

以上清单可作为下一阶段学习 Java Web 的参考路线，每攻克一个知识点都可以用当前项目的业务（统计、审核、推送等）来做实战练习。

## Java 基础知识盲区

### 1. 枚举与常量模式
- **现状**：`EmailType`、`ShortStoryStatus` 等状态都用静态整型常量表示（server/common/src/main/java/org/ppnovel/common/constant/ShortStoryStatus.java:4-30），没有 `enum` 的类型安全、方法重写和自带 `values()` 遍历等能力。
- **可练方向**：把状态迁移为 `enum` 并实践自定义字段/方法、`EnumMap`、`EnumSet` 等高级用法。

### 2. 集合类型的多样化
- **现状**：`ArrayList` 只在文件白名单中简单使用（server/web/src/main/java/org/ppnovel/web/service/upload/UploadService.java:42-56），而 `java.util.Set`、`HashSet`、`TreeSet` 等在源码中完全缺席（`grep -R "java.util.Set" server/web/src/main/java` 无结果），意味着还没练习去重、元素判重或自动排序的集合。
- **可练方向**：根据业务（如收藏、标签）尝试使用 `Set`、`Map` 的 `computeIfAbsent`，比较 `ArrayList` / `LinkedList` 在随机读写下的差异。

### 3. 队列与双端队列
- **现状**：源码里找不到 `Queue`、`Deque`、`PriorityQueue`（`grep -R "java.util.Queue" server/web/src/main/java` 为空），因此对 FIFO/优先队列/双端队列的语法和典型 API（`offer`/`poll`/`peek`）仍是空白。
- **可练方向**：以异步任务、待审核列表为例练习 `LinkedList` 实现的 `Deque`、`PriorityQueue` 的排序特性或 `ArrayDeque` 的性能优势。

### 4. Stream / Collectors / Comparator
- **现状**：遍历场景基本用 `for` 或 `forEach`，`grep -R "\.stream" server/web/src/main/java` 无命中，`Comparator` 也未出现。这导致过滤、分组、排序等操作无法体验函数式流水线写法。
- **可练方向**：将分页或统计逻辑改写为 `stream` + `filter` + `collect(Collectors.groupingBy(...))`，并尝试 `Comparator.comparing`、`thenComparing` 等排序技巧。

### 5. 数值与货币类
- **现状**：项目只用 `Integer`/`Long` 处理数量（例如 `ShortStoryAnalyticsEntity` 字段），全局未出现 `BigDecimal`（`grep -R "BigDecimal" server/common/src/main/java` 为空），因此尚未覆盖高精度计算、保留小数位等基础技能。
- **可练方向**：在虚拟币/分成等场景中使用 `BigDecimal`，理解 `scale`、`RoundingMode`、`compareTo` 的区别。

### 6. 原生并发工具
- **现状**：除了 Spring `@Async`（server/web/src/main/java/org/ppnovel/web/service/user/UserInitService.java:34,57）外，没有 `Thread`、`Runnable`、`ExecutorService`、`CompletableFuture`、`synchronized`、`Lock` 等 `java.util.concurrent` 语法（`grep -R "synchronized" server/web/src/main/java` 为空），尚未掌握线程池参数、任务取消、Future 编排等概念。
- **可练方向**：实现一个自定义的统计任务，分别用 `ExecutorService`、`CompletableFuture`、`CountDownLatch` 等方式并发执行，体会线程安全与共享资源保护。

### 7. I/O 与 try-with-resources
- **现状**：项目只与数据库/Redis交互，没有直接使用 `java.io.*` 或 `java.nio.file.*`，也没有 `try-with-resources` 模式读取配置或生成文件。
- **可练方向**：编写导出报表/日志分析工具时，实践 `Files.newBufferedWriter`、`try (var writer = ...) {}`、`Path`、`Files.walk` 等 API，理解缓冲流、字符集、异常处理。
