/*
 Navicat Premium Dump SQL

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 90400 (9.4.0)
 Source Host           : localhost:3306
 Source Schema         : pp_novel

 Target Server Type    : MySQL
 Target Server Version : 90400 (9.4.0)
 File Encoding         : 65001

 Date: 23/11/2025 18:14:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for short_story
-- ----------------------------
DROP TABLE IF EXISTS `short_story`;
CREATE TABLE `short_story` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '短故事名称',
  `content` text NOT NULL COMMENT '短故事详情',
  `cover` varchar(255) DEFAULT NULL COMMENT '推荐封面',
  `toutiao_cover` varchar(255) DEFAULT NULL COMMENT '头条封面',
  `free_paragraph` int DEFAULT NULL COMMENT '试读段落数',
  `free_rate` int DEFAULT NULL COMMENT '试读比例',
  `recommend_title` varchar(255) DEFAULT NULL COMMENT '头条推荐标题',
  `content_length` int NOT NULL COMMENT '详情长度',
  `created_at` datetime NOT NULL COMMENT '创建日期',
  `updated_at` datetime DEFAULT NULL COMMENT '更新日期',
  `author_id` int NOT NULL COMMENT '作者id',
  `status` tinyint NOT NULL COMMENT '状态，0是审核中，1是已通过，2是审核不通过',
  PRIMARY KEY (`id`),
  KEY `authorId` (`author_id`),
  CONSTRAINT `short_story_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='短故事';

-- ----------------------------
-- Table structure for short_story_analytics
-- ----------------------------
DROP TABLE IF EXISTS `short_story_analytics`;
CREATE TABLE `short_story_analytics` (
  `short_story_id` int NOT NULL COMMENT '短故事ID',
  `total_reads` int NOT NULL DEFAULT '0' COMMENT '总阅读量',
  `total_favorites` int NOT NULL DEFAULT '0' COMMENT '总加入书架量',
  `payment_count` int NOT NULL DEFAULT '0' COMMENT '付费人数',
  `readers` int NOT NULL DEFAULT '0' COMMENT '15秒阅读人数',
  `fifteen_second_readers` int NOT NULL DEFAULT '0' COMMENT '15秒阅读人数',
  `thirty_second_readers` int NOT NULL DEFAULT '0' COMMENT '30秒阅读人数',
  `sixty_second_readers` int NOT NULL DEFAULT '0' COMMENT '60秒阅读人数',
  `bottom_readers` int NOT NULL DEFAULT '0' COMMENT '触底人数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='短故事分析数据';

-- ----------------------------
-- Table structure for short_story_category
-- ----------------------------
DROP TABLE IF EXISTS `short_story_category`;
CREATE TABLE `short_story_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='短故事分类';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `pseudonym` varchar(50) NOT NULL COMMENT '笔名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `phone` char(20) DEFAULT NULL COMMENT '手机',
  `qq` char(15) DEFAULT NULL COMMENT 'qq',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '头像地址',
  `desc` varchar(2000) DEFAULT NULL COMMENT '作者介绍',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `uid` int NOT NULL,
  `exp` int unsigned NOT NULL DEFAULT '0' COMMENT '经验值',
  `is_delete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `has_register_writer` tinyint NOT NULL DEFAULT (0) COMMENT '是否注册成了作者',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户';

-- ----------------------------
-- Table structure for user_short_story_progress
-- ----------------------------
DROP TABLE IF EXISTS `user_short_story_progress`;
CREATE TABLE `user_short_story_progress` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '进度ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `short_story_id` int NOT NULL COMMENT '短故事ID',
  `reading_time` int NOT NULL DEFAULT (0) COMMENT '阅读时长（秒）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户阅读进度';

-- ----------------------------
-- Table structure for writer
-- ----------------------------
DROP TABLE IF EXISTS `writer`;
CREATE TABLE `writer` (
  `user_id` int NOT NULL COMMENT '用户ID',
  `book_count` tinyint NOT NULL DEFAULT (0) COMMENT '小说数量',
  `short_story_count` tinyint NOT NULL DEFAULT (0) COMMENT '短故事数量',
  `book_chapter_count` smallint NOT NULL DEFAULT (0) COMMENT '小说章节',
  `book_char_count` int NOT NULL DEFAULT (0) COMMENT '小说总字数',
  `short_story_char_count` int NOT NULL DEFAULT (0) COMMENT '短故事总字数',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='作家数据';

SET FOREIGN_KEY_CHECKS = 1;
