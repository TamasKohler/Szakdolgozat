CREATE DATABASE teams;

CREATE TABLE `teams`.`items` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `description` LONGTEXT NOT NULL,
  `position` INT NOT NULL,
  `chanelOrChatId` VARCHAR(128) NOT NULL
);
