#!/bin/bash

# 数据库连接脚本
# 从 application-dev.yml 读取配置并连接到数据库

# 数据库配置
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="pp_novel"
DB_USER="root"
DB_PASS="123456789"

# 检查 MySQL 是否安装
if ! command -v mysql &> /dev/null; then
    echo "错误: MySQL 客户端未安装"
    echo "macOS 安装: brew install mysql-client"
    echo "Ubuntu 安装: sudo apt-get install mysql-client"
    exit 1
fi

# 检查参数
if [ "$1" == "-e" ] && [ -n "$2" ]; then
    # 执行 SQL 语句
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$2"
elif [ "$1" == "-f" ] && [ -n "$2" ]; then
    # 执行 SQL 文件
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$2"
else
    # 交互式连接
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME"
fi
