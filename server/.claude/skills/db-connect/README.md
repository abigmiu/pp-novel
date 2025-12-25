# Database Connection Skill

这个目录包含数据库连接相关的工具和文档。

## 文件说明

- `SKILL.md` - Skill 主文件，包含数据库连接的详细说明
- `connect.sh` - 数据库连接辅助脚本

## 快速使用

### 交互式连接
```bash
./.claude/skills/db-connect/connect.sh
```

### 执行单条 SQL
```bash
./.claude/skills/db-connect/connect.sh -e "SHOW TABLES;"
```

### 执行 SQL 文件
```bash
./.claude/skills/db-connect/connect.sh -f schema.sql
```

## 配置来源

数据库配置自动从以下文件读取：
- `server/web/src/main/resources/application-dev.yml`

## 数据库信息

- **数据库名**: pp_novel
- **主机**: localhost:3306
- **用户**: root
