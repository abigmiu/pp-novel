# 🍅 西红柿小说（pp-novel）— Server

这是一个基于 Spring Boot 的个人学习项目后端（只写 server 端）。目前以「能跑通核心链路」为主，细节（如参数校验/异常/权限模型/测试覆盖等）仍在逐步完善中。

## ✨ 已实现主要功能（后端）

- 🔐 用户体系：邮箱注册/登录 + 登录态（Sa-Token）
- 📨 邮箱验证码：验证码写入 Redis，邮件发送通过 RabbitMQ 异步消费
- ✍️ 短故事：创建、草稿、阅读进度等基础能力
- 🧩 短故事协同编辑（可选）：Yjs（单独的 `yjs-server` 服务）
- 📚 小说：作家侧创建与基础管理、读者侧基础互动（收藏/点赞/追更等）
- 🔔 通知/站内信：消息模板、列表、未读数、批量已读
- 💰 钱包与付费：余额、充值、流水、章节购买（学习用链路）
- ☁️ 上传：封面上传（预签名 URL 思路，OSS/S3 相关配置）
- 🔎 搜索：Elasticsearch（章节检索/搜索相关）

## 🧱 技术栈（后端）

Spring Boot 3.4 + Java 21、MyBatis-Plus、MySQL、Redis、Sa-Token、RabbitMQ、Elasticsearch、SpringDoc OpenAPI。

## 🚧 本地开发（最小说明）

### 依赖

- JDK 21、Maven
- MySQL（库：`pp_novel`，结构：`server/persistent/pp_novel.sql`）
- Redis、RabbitMQ
- Elasticsearch（不使用搜索功能可先不启）

### 配置

配置在 `server/web/src/main/resources/`：

- `application.yml` 默认启用 `dev`，并 `include: local`
- `application-local.yml` 主要放敏感信息（邮件、OSS Key 等），本地自备即可

### 启动

```bash
cd server
mvn -pl web -am spring-boot:run
```

默认端口：`8080`；日志：`server/logs/web-app.log`

## 🧩 可选：启动协同编辑服务（yjs-server）

```bash
cd yjs-server
pnpm install --frozen-lockfile
pnpm dev
```

## 📝 备注

- 本仓库会用到邮件与对象存储相关的 Key/密码，请务必放在本地配置里，不要提交到 git。
