/*
 Navicat Premium Dump SQL

 Source Server         : project bertahan hidup
 Source Server Type    : MariaDB
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : qq_chat

 Target Server Type    : MariaDB
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 14/06/2025 01:09:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for friend_list
-- ----------------------------
DROP TABLE IF EXISTS `friend_list`;
CREATE TABLE `friend_list`  (
  `id_friend` bigint(20) NOT NULL AUTO_INCREMENT,
  `QUID` bigint(20) NOT NULL,
  `QUID_friend` bigint(20) NOT NULL,
  PRIMARY KEY (`id_friend`) USING BTREE,
  INDEX `QUID_person`(`QUID`) USING BTREE,
  INDEX `QUID_friend`(`QUID_friend`) USING BTREE,
  CONSTRAINT `QIOD_friend003` FOREIGN KEY (`QUID_friend`) REFERENCES `qq_member` (`QUID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Quid_person002` FOREIGN KEY (`QUID`) REFERENCES `qq_member` (`QUID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend_list
-- ----------------------------
INSERT INTO `friend_list` VALUES (1, 1, 2);
INSERT INTO `friend_list` VALUES (2, 1, 3);
INSERT INTO `friend_list` VALUES (3, 2, 1);
INSERT INTO `friend_list` VALUES (4, 1, 5);
INSERT INTO `friend_list` VALUES (5, 2, 3);
INSERT INTO `friend_list` VALUES (6, 3, 2);
INSERT INTO `friend_list` VALUES (7, 15, 14);
INSERT INTO `friend_list` VALUES (9, 14, 15);

-- ----------------------------
-- Table structure for group_member_data_list_wa
-- ----------------------------
DROP TABLE IF EXISTS `group_member_data_list_wa`;
CREATE TABLE `group_member_data_list_wa`  (
  `group_gen_mid` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_xid` bigint(20) NULL DEFAULT NULL,
  `QUID` bigint(11) NULL DEFAULT NULL,
  `group_member_authority` int(11) NULL DEFAULT NULL,
  `timeAdd` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`group_gen_mid`) USING BTREE,
  INDEX `group_xid1038und`(`group_xid`) USING BTREE,
  INDEX `QUID_Denioecj32f`(`QUID`) USING BTREE,
  CONSTRAINT `QUID_ej39nb3uf` FOREIGN KEY (`QUID`) REFERENCES `qq_member` (`QUID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_ee0832jf` FOREIGN KEY (`group_xid`) REFERENCES `group_member_data_wa` (`group_xid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_member_data_list_wa
-- ----------------------------
INSERT INTO `group_member_data_list_wa` VALUES (1, 1, 1, -1, '2025-05-16 15:39:37');
INSERT INTO `group_member_data_list_wa` VALUES (2, 1, 2, 1, '2025-05-16 15:39:56');
INSERT INTO `group_member_data_list_wa` VALUES (3, 1, 3, 1, '2025-05-16 15:40:14');
INSERT INTO `group_member_data_list_wa` VALUES (4, 1, 5, 1, '2025-05-16 15:40:54');
INSERT INTO `group_member_data_list_wa` VALUES (6, 1, 6, 1, '2025-05-16 15:41:04');
INSERT INTO `group_member_data_list_wa` VALUES (7, 2, 1, -1, '2025-05-16 15:41:33');
INSERT INTO `group_member_data_list_wa` VALUES (8, 2, 2, 1, '2025-05-16 15:41:47');
INSERT INTO `group_member_data_list_wa` VALUES (9, 2, 3, 1, '2025-05-16 15:42:05');

-- ----------------------------
-- Table structure for group_member_data_wa
-- ----------------------------
DROP TABLE IF EXISTS `group_member_data_wa`;
CREATE TABLE `group_member_data_wa`  (
  `group_xid` bigint(20) NOT NULL,
  `group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `QUID` bigint(20) NULL DEFAULT NULL,
  `group_time_create` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`group_xid`) USING BTREE,
  INDEX `QUID_n383fmqwews`(`QUID`) USING BTREE,
  CONSTRAINT `QUID_esijw30io3` FOREIGN KEY (`QUID`) REFERENCES `qq_member` (`QUID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_member_data_wa
-- ----------------------------
INSERT INTO `group_member_data_wa` VALUES (1, 'Ancient_Legend', 1, '2025-05-16 18:03:16');
INSERT INTO `group_member_data_wa` VALUES (2, 'Time Gate', 1, '2025-05-16 18:03:26');

-- ----------------------------
-- Table structure for group_member_message_wa
-- ----------------------------
DROP TABLE IF EXISTS `group_member_message_wa`;
CREATE TABLE `group_member_message_wa`  (
  `id_msgrp` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_xid` bigint(20) NULL DEFAULT NULL,
  `QUID` bigint(20) NULL DEFAULT NULL,
  `group_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `timestamp` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_msgrp`) USING BTREE,
  INDEX `gorup_id`(`group_xid`) USING BTREE,
  INDEX `QUID_p`(`QUID`) USING BTREE,
  CONSTRAINT `QUID_3bnj4` FOREIGN KEY (`QUID`) REFERENCES `qq_member` (`QUID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `grup_39jrnr` FOREIGN KEY (`group_xid`) REFERENCES `group_member_data_wa` (`group_xid`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_member_message_wa
-- ----------------------------
INSERT INTO `group_member_message_wa` VALUES (1, 1, 1, 'halo semuanya selamat datang di ancient legend', '2025-05-16 15:42:55');
INSERT INTO `group_member_message_wa` VALUES (2, 1, 2, 'halo juga maki', '2025-05-16 18:21:15');
INSERT INTO `group_member_message_wa` VALUES (3, 2, 1, 'halo di TIme gate', '2025-05-16 18:22:21');
INSERT INTO `group_member_message_wa` VALUES (4, 2, 2, 'hallo iam', '2025-05-16 20:34:27');
INSERT INTO `group_member_message_wa` VALUES (5, 2, 2, 'hallo negr', '2025-05-16 20:36:21');
INSERT INTO `group_member_message_wa` VALUES (7, 2, 3, 'hallo korvete', '2025-05-16 20:37:01');
INSERT INTO `group_member_message_wa` VALUES (9, 1, 2, 'qweefwe', '2025-05-16 21:47:40');
INSERT INTO `group_member_message_wa` VALUES (10, 1, 2, 'asfqef', '2025-05-16 21:50:38');
INSERT INTO `group_member_message_wa` VALUES (11, 1, 1, 'feeffe', '2025-05-16 21:57:33');
INSERT INTO `group_member_message_wa` VALUES (12, 1, 1, 'hello all', '2025-05-16 22:02:02');
INSERT INTO `group_member_message_wa` VALUES (13, 1, 2, 'hello guys', '2025-05-16 22:04:02');
INSERT INTO `group_member_message_wa` VALUES (14, 1, 2, 'hola ima efo', '2025-05-16 22:09:21');
INSERT INTO `group_member_message_wa` VALUES (15, 1, 3, 'ial say it', '2025-05-16 22:11:01');
INSERT INTO `group_member_message_wa` VALUES (16, 1, 1, 'ybbunumim', '2025-05-16 22:11:08');
INSERT INTO `group_member_message_wa` VALUES (17, 1, 2, 'ijhbunon', '2025-05-16 22:11:15');
INSERT INTO `group_member_message_wa` VALUES (18, 2, 2, 'ijhbnijnjn', '2025-05-16 22:11:27');
INSERT INTO `group_member_message_wa` VALUES (19, 1, 1, 'cihuy its work', '2025-05-17 19:30:37');
INSERT INTO `group_member_message_wa` VALUES (20, 2, 1, 'nah bro its just easy code', '2025-05-17 19:30:51');
INSERT INTO `group_member_message_wa` VALUES (21, 2, 1, 'anjing anjir', '2025-05-17 23:08:29');
INSERT INTO `group_member_message_wa` VALUES (22, 2, 1, 'dqwdf', '2025-05-17 23:08:34');
INSERT INTO `group_member_message_wa` VALUES (23, NULL, 1, 'sdasdad', '2025-05-17 23:18:35');
INSERT INTO `group_member_message_wa` VALUES (24, NULL, 1, 'afsasfasf', '2025-05-17 23:18:44');
INSERT INTO `group_member_message_wa` VALUES (25, 2, 1, 'test for', '2025-05-17 23:20:38');
INSERT INTO `group_member_message_wa` VALUES (26, 2, 1, 'halo iam in chats but who', '2025-05-17 23:21:02');

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) NULL DEFAULT NULL,
  `receiver_id` bigint(20) NULL DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_received` tinyint(1) NULL DEFAULT NULL,
  `is_readed` tinyint(1) NULL DEFAULT NULL,
  `timestamp` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sender_id`(`sender_id`) USING BTREE,
  INDEX `receiver_id`(`receiver_id`) USING BTREE,
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `qq_member` (`QUID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `qq_member` (`QUID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of messages
-- ----------------------------
INSERT INTO `messages` VALUES (1, 1, 2, 'hello nano', 1, 1, '2025-04-21 00:54:56');
INSERT INTO `messages` VALUES (2, 2, 1, 'oh hey maki', 1, 1, '2025-04-21 00:56:00');
INSERT INTO `messages` VALUES (3, 1, 3, 'te qos vei ra van de', 1, 0, '2025-04-21 00:56:43');
INSERT INTO `messages` VALUES (4, 1, 2, 'hello to <name>', 1, 1, '2025-04-21 23:00:58');
INSERT INTO `messages` VALUES (5, 1, 2, 'qqt', 1, 1, '2025-04-21 23:04:39');
INSERT INTO `messages` VALUES (6, 1, 2, 'hello', 1, 1, '2025-04-21 23:07:56');
INSERT INTO `messages` VALUES (7, 1, 3, 'halo hime', 1, NULL, '2025-04-21 23:09:04');
INSERT INTO `messages` VALUES (8, 1, 2, 'vein', 1, 1, '2025-04-21 23:09:42');
INSERT INTO `messages` VALUES (9, 1, 3, 'loe', 1, NULL, '2025-04-21 23:10:02');
INSERT INTO `messages` VALUES (10, 1, 2, 'eeee', 1, 1, '2025-04-21 23:10:07');
INSERT INTO `messages` VALUES (11, 1, 2, 'mau kok gak kenek', 1, 1, '2025-04-21 23:10:16');
INSERT INTO `messages` VALUES (12, 2, 1, 'yo gak ero lah', 1, 1, '2025-04-21 23:10:43');
INSERT INTO `messages` VALUES (13, 1, 2, 'jadi gimana', 1, 1, '2025-04-21 23:19:10');
INSERT INTO `messages` VALUES (14, 2, 1, 'bejirrr', 1, 1, '2025-04-21 23:22:57');
INSERT INTO `messages` VALUES (15, 2, 1, 'gwacor king', 1, 1, '2025-04-21 23:23:07');
INSERT INTO `messages` VALUES (16, 1, 2, 'anjay', 1, 1, '2025-04-21 23:23:13');
INSERT INTO `messages` VALUES (17, 1, 2, 'work njir lah', 1, 1, '2025-04-21 23:23:28');
INSERT INTO `messages` VALUES (18, 2, 1, 'udah sangat amat bagus untuk progres minggu pertama', 1, 1, '2025-04-21 23:23:36');
INSERT INTO `messages` VALUES (19, 1, 2, 'wqwq', 1, 1, '2025-04-21 23:23:47');
INSERT INTO `messages` VALUES (20, 2, 1, 'gokil parah', 1, 1, '2025-04-21 23:24:18');
INSERT INTO `messages` VALUES (21, 2, 1, 'id password e iki karo ketik en engko tak kirim e nak grub', 1, 1, '2025-04-21 23:24:39');
INSERT INTO `messages` VALUES (22, 2, 1, 'bjir amanda', 1, 1, '2025-04-21 23:27:50');
INSERT INTO `messages` VALUES (23, 1, 3, 'lets play tomorow', 1, NULL, '2025-04-22 21:37:11');
INSERT INTO `messages` VALUES (24, 2, 1, 'Anjing', 1, 1, '2025-04-23 13:27:18');
INSERT INTO `messages` VALUES (25, 2, 1, 'Hendra peod', 1, 1, '2025-04-23 13:27:25');
INSERT INTO `messages` VALUES (26, 1, 2, 'rill', 1, 1, '2025-04-23 13:27:39');
INSERT INTO `messages` VALUES (27, 2, 1, 'Kuda', 1, 1, '2025-04-23 13:27:43');
INSERT INTO `messages` VALUES (28, 2, 3, 'Hime', 1, 1, '2025-04-23 13:31:02');
INSERT INTO `messages` VALUES (29, 3, 2, 'hell', 1, NULL, '2025-04-24 01:25:02');
INSERT INTO `messages` VALUES (30, 3, 2, 'hell nah', 1, NULL, '2025-04-24 11:27:16');
INSERT INTO `messages` VALUES (32, 14, 15, 'halo', NULL, NULL, '2025-04-26 14:36:11');
INSERT INTO `messages` VALUES (33, 15, 14, 'halo juga hend', NULL, NULL, '2025-04-26 14:36:18');
INSERT INTO `messages` VALUES (34, 15, 14, 'qq', NULL, NULL, '2025-04-26 14:36:40');
INSERT INTO `messages` VALUES (35, 1, 3, 'jrlek e', 1, NULL, '2025-05-10 13:58:55');
INSERT INTO `messages` VALUES (36, 1, 3, 'halo hend', 1, NULL, '2025-05-10 16:35:13');
INSERT INTO `messages` VALUES (37, 1, NULL, 'halo', NULL, NULL, '2025-05-16 20:17:34');
INSERT INTO `messages` VALUES (38, 1, 2, 'hell nah', 1, 1, '2025-05-17 09:35:28');
INSERT INTO `messages` VALUES (39, 1, 5, 'panteq', NULL, NULL, '2025-05-17 20:47:54');
INSERT INTO `messages` VALUES (40, 1, 2, 'ergrsg', 1, 1, '2025-05-17 23:16:56');
INSERT INTO `messages` VALUES (41, 1, 2, 'wqdwead', 1, 1, '2025-05-17 23:17:00');
INSERT INTO `messages` VALUES (42, 1, 3, 'qwdwd', 1, NULL, '2025-05-17 23:17:05');
INSERT INTO `messages` VALUES (43, 1, 2, 'fgtcbhtd', 1, 1, '2025-05-17 23:19:00');
INSERT INTO `messages` VALUES (44, 1, 2, 'halo nano iam in chats', 1, 1, '2025-05-17 23:20:15');
INSERT INTO `messages` VALUES (45, 1, 3, 'adfasdfa', 1, NULL, '2025-05-17 23:24:59');
INSERT INTO `messages` VALUES (46, 2, 1, 'oi', 1, 1, '2025-06-09 20:26:58');
INSERT INTO `messages` VALUES (47, 1, 2, 'oi juga', 1, 1, '2025-06-09 20:27:30');
INSERT INTO `messages` VALUES (48, 1, 2, 'owalah nano', 1, 1, '2025-06-09 20:41:26');
INSERT INTO `messages` VALUES (49, 1, 2, 'hei', 1, 1, '2025-06-10 20:45:48');
INSERT INTO `messages` VALUES (50, 1, 2, 'hei hei', 1, 1, '2025-06-10 20:46:04');
INSERT INTO `messages` VALUES (51, 1, 2, 'hola', 1, 1, '2025-06-10 20:48:39');
INSERT INTO `messages` VALUES (52, 3, 2, 'nah bro', 1, NULL, '2025-06-13 21:43:23');
INSERT INTO `messages` VALUES (53, 2, 1, 'nah bro', 1, 1, '2025-06-13 21:44:43');

-- ----------------------------
-- Table structure for qq_member
-- ----------------------------
DROP TABLE IF EXISTS `qq_member`;
CREATE TABLE `qq_member`  (
  `QUID` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`QUID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of qq_member
-- ----------------------------
INSERT INTO `qq_member` VALUES (1, 'maki');
INSERT INTO `qq_member` VALUES (2, 'nano');
INSERT INTO `qq_member` VALUES (3, 'hime');
INSERT INTO `qq_member` VALUES (5, 'makoto');
INSERT INTO `qq_member` VALUES (6, 'mekigan');
INSERT INTO `qq_member` VALUES (9, 'user7');
INSERT INTO `qq_member` VALUES (10, 'user10');
INSERT INTO `qq_member` VALUES (12, 'user11');
INSERT INTO `qq_member` VALUES (13, 'user13');
INSERT INTO `qq_member` VALUES (14, 'hendra');
INSERT INTO `qq_member` VALUES (15, 'al-ubed');
INSERT INTO `qq_member` VALUES (16, 'user16');
INSERT INTO `qq_member` VALUES (17, 'user17');
INSERT INTO `qq_member` VALUES (18, 'user18');
INSERT INTO `qq_member` VALUES (19, 'user19');

-- ----------------------------
-- Table structure for qq_member_auth
-- ----------------------------
DROP TABLE IF EXISTS `qq_member_auth`;
CREATE TABLE `qq_member_auth`  (
  `QUID` bigint(20) NULL DEFAULT NULL,
  `id_auth` int(19) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `no_telp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_auth`) USING BTREE,
  INDEX `QUID`(`QUID`) USING BTREE,
  CONSTRAINT `qq_member_id001` FOREIGN KEY (`QUID`) REFERENCES `qq_member` (`QUID`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of qq_member_auth
-- ----------------------------
INSERT INTO `qq_member_auth` VALUES (1, 1, 'maki@', '083891292636', 'hacker');
INSERT INTO `qq_member_auth` VALUES (2, 2, 'nano@', NULL, 'hacker');
INSERT INTO `qq_member_auth` VALUES (3, 3, 'hime@', NULL, 'hacker');
INSERT INTO `qq_member_auth` VALUES (5, 5, 'makoto@', NULL, 'hunter');
INSERT INTO `qq_member_auth` VALUES (6, 6, 'mekigan@', NULL, 'hunter');
INSERT INTO `qq_member_auth` VALUES (9, 9, 'makio@', NULL, 'hacker');
INSERT INTO `qq_member_auth` VALUES (10, 10, 'qiqi@', NULL, 'hacker');
INSERT INTO `qq_member_auth` VALUES (12, 12, 'toki@', NULL, 'haniel');
INSERT INTO `qq_member_auth` VALUES (13, 13, 'meido@', NULL, 'haniel');
INSERT INTO `qq_member_auth` VALUES (14, 14, 'hendra@', NULL, 'haniel');
INSERT INTO `qq_member_auth` VALUES (15, 15, 'al@', NULL, 'hacker');
INSERT INTO `qq_member_auth` VALUES (16, 16, 'dontol@', NULL, 'manukEkecil');
INSERT INTO `qq_member_auth` VALUES (17, 17, 'dontol1@', NULL, 'aofncoaen');
INSERT INTO `qq_member_auth` VALUES (18, 18, 'dontol2@', NULL, 'sdcsdcvfv');
INSERT INTO `qq_member_auth` VALUES (19, 19, 'dontolfaf@', NULL, 'fasefaef');

-- ----------------------------
-- Procedure structure for app_registration
-- ----------------------------
DROP PROCEDURE IF EXISTS `app_registration`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `app_registration`(IN opsi BOOL, IN userData VARCHAR(255), IN Spassword VARCHAR(255))
BEGIN
  
  DECLARE U_QUID VARCHAR(255);
  
  set U_QUID = CONCAT('user', ((SELECT QUID FROM qq_member ORDER BY QUID desc LIMIT 1) + 1));
  
  IF opsi = 1 THEN
    INSERT INTO qq_member (username) VALUES (U_QUID);
    INSERT INTO qq_member_auth (QUID, email, password) VALUES (LAST_INSERT_ID(), userData, Spassword);
  ELSEIF opsi = 2 THEN
    SELECT CONCAT("belum bisa");
  END IF;
  
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for check_usedable_email
-- ----------------------------
DROP PROCEDURE IF EXISTS `check_usedable_email`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `check_usedable_email`(IN emailC VARCHAR(255), OUT status BOOL)
BEGIN

DECLARE message VARCHAR(255) DEFAULT "hello";
DECLARE test_objek VARCHAR (255);

  SELECT email INTO test_objek FROM qq_member_auth WHERE email = emailC;
  
  IF(test_objek = emailC) THEN
    set status = false;
  ELSE
    set status = true;
  END IF;
  
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
