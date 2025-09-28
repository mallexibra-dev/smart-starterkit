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

-- Create products table
CREATE TABLE `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT UNSIGNED NOT NULL DEFAULT 0,
  `category` VARCHAR(100) NULL,
  `sku` VARCHAR(100) NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_unique` (`sku`),
  KEY `products_category_idx` (`category`),
  KEY `products_status_idx` (`status`),
  KEY `products_deleted_at_idx` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create transactions table
CREATE TABLE `transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `transaction_type` ENUM('purchase', 'sale', 'return') NOT NULL DEFAULT 'sale',
  `status` ENUM('pending', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  `payment_method` VARCHAR(50) NULL,
  `reference_number` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `transactions_reference_number_unique` (`reference_number`),
  KEY `transactions_user_id_idx` (`user_id`),
  KEY `transactions_product_id_idx` (`product_id`),
  KEY `transactions_transaction_type_idx` (`transaction_type`),
  KEY `transactions_status_idx` (`status`),
  KEY `transactions_deleted_at_idx` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data
INSERT INTO `users` (`name`, `username`, `email`, `password`) VALUES
('Alice Example', 'alice', 'alice@example.com', NULL),
('Bob Example', 'bob', 'bob@example.com', NULL),
('Charlie Example', 'charlie', 'charlie@example.com', NULL);

-- Seed data for products
INSERT INTO `products` (`name`, `description`, `price`, `stock`, `category`, `sku`, `status`) VALUES
('Laptop Gaming ASUS', 'High performance gaming laptop with RTX 4060', 15000000.00, 25, 'Electronics', 'ASUS-GAM-001', 'active'),
('Smartphone Samsung Galaxy', 'Latest Samsung Galaxy with 128GB storage', 8500000.00, 50, 'Electronics', 'SAM-GAL-128', 'active'),
('Wireless Mouse Logitech', 'Ergonomic wireless mouse with long battery life', 350000.00, 100, 'Accessories', 'LOG-MOU-WL1', 'active'),
('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 750000.00, 75, 'Accessories', 'KEY-MEC-RGB', 'active'),
('Monitor 24 inch', '24 inch Full HD IPS monitor', 2500000.00, 30, 'Electronics', 'MON-24-FHD', 'active'),
('USB Cable Type-C', 'Fast charging USB Type-C cable 1 meter', 85000.00, 200, 'Accessories', 'USB-TC-1M', 'active'),
('Headset Gaming', 'Professional gaming headset with microphone', 650000.00, 40, 'Audio', 'HEAD-GAM-PRO', 'active'),
('Webcam HD', 'Full HD webcam for video calls', 450000.00, 60, 'Electronics', 'WEB-HD-001', 'active');

-- Seed data for transactions
INSERT INTO `transactions` (`user_id`, `product_id`, `quantity`, `unit_price`, `total_price`, `transaction_type`, `status`, `payment_method`, `reference_number`, `notes`) VALUES
(1, 1, 1, 15000000.00, 15000000.00, 'sale', 'completed', 'credit_card', 'TXN-001-2024', 'First laptop purchase'),
(2, 2, 2, 8500000.00, 17000000.00, 'sale', 'completed', 'bank_transfer', 'TXN-002-2024', 'Bulk smartphone order'),
(3, 3, 5, 350000.00, 1750000.00, 'sale', 'completed', 'cash', 'TXN-003-2024', 'Office mouse purchase'),
(1, 4, 1, 750000.00, 750000.00, 'sale', 'pending', 'credit_card', 'TXN-004-2024', 'Keyboard for gaming setup'),
(2, 5, 2, 2500000.00, 5000000.00, 'sale', 'completed', 'bank_transfer', 'TXN-005-2024', 'Dual monitor setup'),
(3, 6, 10, 85000.00, 850000.00, 'sale', 'completed', 'cash', 'TXN-006-2024', 'USB cables for office'),
(1, 7, 1, 650000.00, 650000.00, 'sale', 'completed', 'e_wallet', 'TXN-007-2024', 'Gaming headset'),
(2, 8, 3, 450000.00, 1350000.00, 'sale', 'cancelled', 'credit_card', 'TXN-008-2024', 'Webcam order cancelled'),
(3, 1, 1, 15000000.00, 15000000.00, 'return', 'completed', 'refund', 'TXN-009-2024', 'Laptop return - defective'),
(1, 2, 1, 8500000.00, 8500000.00, 'sale', 'completed', 'credit_card', 'TXN-010-2024', 'Personal smartphone');
