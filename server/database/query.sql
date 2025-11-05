-- Drop existing tables if they exist
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `users`;

-- Create users table
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `password` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_deleted_at_idx` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sessions table
CREATE TABLE `sessions` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `refresh_token` VARCHAR(255) NOT NULL,
  `refresh_expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `sessions_refresh_token_unique` (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data (password: password123 for all users)
INSERT INTO `users` (`name`, `username`, `email`, `password`) VALUES
('Alice Example', 'alice', 'alice@example.com', '$argon2id$v=19$m=65536,t=2,p=1$qmnACr+e+ghMmSwRnUL8qO8iugi/4wimNIqnRjsdujU$+JHULuK+qJGh9Ht0OpwS5FBupCK7RzP1DIs/VUAUXyc'),
('Bob Example', 'bob', 'bob@example.com', '$argon2id$v=19$m=65536,t=2,p=1$qmnACr+e+ghMmSwRnUL8qO8iugi/4wimNIqnRjsdujU$+JHULuK+qJGh9Ht0OpwS5FBupCK7RzP1DIs/VUAUXyc'),
('Charlie Example', 'charlie', 'charlie@example.com', '$argon2id$v=19$m=65536,t=2,p=1$qmnACr+e+ghMmSwRnUL8qO8iugi/4wimNIqnRjsdujU$+JHULuK+qJGh9Ht0OpwS5FBupCK7RzP1DIs/VUAUXyc');
