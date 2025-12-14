#!/usr/bin/env bash
set -e

BACKUP_DIR="/root/.cnb/ci_data"
MYSQL_CONTAINER="mysql"
REDIS_CONTAINER="redis"
MYSQL_USER="root"
MYSQL_PASSWORD="a12346789"
MYSQL_DB="pp_novel"

mkdir -p "$BACKUP_DIR"

echo "=== 导出 MySQL 数据 ==="
docker exec $MYSQL_CONTAINER mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB > "$BACKUP_DIR/mysql_dump.sql"
echo "✅ 导出mysql成功"

echo "=== 导出 Redis 数据 ==="
# Redis 默认 dump.rdb 文件路径为 /data/dump.rdb
docker exec $REDIS_CONTAINER redis-cli SAVE
docker cp $REDIS_CONTAINER:/data/dump.rdb "$BACKUP_DIR/redis_dump.rdb"
echo "✅ 导出redis成功"


echo "== 导出开发配置 =="
cp /workspace/server/web/src/main/resources/application-local.yml "$BACKUP_DIR/server-web-application-local.yml"
echo "✅ 导出开发配置成功"

echo "✅ 数据导出完成：$BACKUP_DIR"