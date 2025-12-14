#!/usr/bin/env bash
set -e

BACKUP_DIR="/root/.cnb/ci_data"
MYSQL_CONTAINER="mysql"
REDIS_CONTAINER="redis"
MYSQL_USER="root"
MYSQL_PASSWORD="a12346789"
MYSQL_DB="pp_novel"

if [ ! -d "$BACKUP_DIR" ]; then
	echo "⚠️ 没有找到备份目录，跳过恢复。"
	exit 0
fi

# ==== MySQL 恢复 ====
echo "=== 恢复 MySQL 数据 ==="
if [ -f "$BACKUP_DIR/mysql_dump.sql" ]; then
	set +e
	echo "等待 MySQL 启动..."
	for i in {1..30}; do
		if docker exec $MYSQL_CONTAINER sh -c "mysqladmin ping -h127.0.0.1 -u$MYSQL_USER -p$MYSQL_PASSWORD --silent"; then
			echo "MySQL 已就绪"
			break
		fi
		echo "第 $i 次重试..."
		sleep 2
	done

	docker exec -i $MYSQL_CONTAINER sh -c \
  		"mysql -h127.0.0.1 -u$MYSQL_USER -p$MYSQL_PASSWORD -e 'CREATE DATABASE IF NOT EXISTS $MYSQL_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'"
	docker exec -i $MYSQL_CONTAINER sh -c \
  		"mysql -h127.0.0.1 -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DB" < "$BACKUP_DIR/mysql_dump.sql"
	MYSQL_STATUS=$?
	set -e

	if [ $MYSQL_STATUS -ne 0 ]; then
		echo "❌ MySQL 数据恢复失败，但流程继续。"
	else
		echo "✅ MySQL 数据恢复完成"
	fi
else
	echo "⚠️ 没有找到 MySQL 备份文件"
fi

# ==== Redis 恢复 ====
echo "=== 恢复 Redis 数据 ==="
if [ -f "$BACKUP_DIR/redis_dump.rdb" ]; then
	set +e
	docker stop $REDIS_CONTAINER >/dev/null 2>&1
	docker cp "$BACKUP_DIR/redis_dump.rdb" $REDIS_CONTAINER:/data/dump.rdb
	docker start $REDIS_CONTAINER >/dev/null 2>&1
	sleep 2
	docker exec $REDIS_CONTAINER redis-cli ping >/dev/null 2>&1
	REDIS_STATUS=$?
	set -e

	if [ $REDIS_STATUS -ne 0 ]; then
		echo "❌ Redis 数据恢复失败，但流程继续。"
	else
		echo "✅ Redis 数据恢复完成"
	fi
else
	echo "⚠️ 没有找到 Redis 备份文件"
fi




echo "== 恢复开发配置 =="
if [ -f "$BACKUP_DIR/server-web-application-local.yml" ]; then
	cp "$BACKUP_DIR/server-web-application-local.yml" /workspace/server/web/src/main/resources/application-local.yml
	echo "✅ 开发配置恢复成功"
else
	echo "⚠️ 没有找到开发配置文件"
fi