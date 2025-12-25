---
name: db-connect
description: This skill should be used when the user asks to "connect to database", "query database", "check database", "run SQL", mentions "MySQL connection", or needs to interact with the project database.
version: 1.0.0
---

# Database Connection Skill

这个 skill 帮助你连接到项目的 MySQL 数据库并执行查询操作。

## 数据库配置

数据库配置从 `server/web/src/main/resources/application-dev.yml` 读取：

- **Host**: localhost
- **Port**: 3306
- **Database**: pp_novel
- **Username**: root
- **Password**: 123456789
- **Driver**: com.mysql.cj.jdbc.Driver

## 使用方法

### 1. 直接使用 MySQL 命令行

```bash
mysql -h localhost -P 3306 -u root -p123456789 pp_novel
```

### 2. 执行 SQL 查询

```bash
mysql -h localhost -P 3306 -u root -p123456789 pp_novel -e "SELECT * FROM your_table LIMIT 10;"
```

### 3. 导出数据库结构

```bash
mysqldump -h localhost -P 3306 -u root -p123456789 --no-data pp_novel > schema.sql
```

### 4. 导出完整数据库

```bash
mysqldump -h localhost -P 3306 -u root -p123456789 pp_novel > backup.sql
```

## 常用操作

### 查看所有表
```sql
SHOW TABLES;
```

### 查看表结构
```sql
DESCRIBE table_name;
```

### 查看表的创建语句
```sql
SHOW CREATE TABLE table_name;
```

### 查询数据
```sql
SELECT * FROM table_name LIMIT 10;
```
## 注意事项

1. **密码安全**: 在命令行中直接使用密码（-p123456789）会有安全警告，生产环境建议使用配置文件或环境变量
2. **连接测试**: 执行查询前先测试连接是否正常
3. **事务处理**: 对于修改操作，建议在事务中执行
4. **备份**: 执行危险操作前先备份数据

## 故障排查

### 连接失败
- 检查 MySQL 服务是否启动：`brew services list | grep mysql` (macOS)
- 检查端口是否被占用：`lsof -i :3306`
- 检查用户权限：确保 root 用户有访问权限

### 字符集问题
- 确保使用 UTF-8 编码：`SET NAMES utf8mb4;`
- 检查数据库字符集：`SHOW VARIABLES LIKE 'character_set%';`
