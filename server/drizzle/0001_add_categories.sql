-- Create categories table
CREATE TABLE `categories` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);

-- Add indexes for categories table
CREATE INDEX `idx_category_name` ON `categories` (`name`);

-- Modify products table to use categoryId instead of category
ALTER TABLE `products` ADD COLUMN `categoryId` int NULL;

-- Add index for categoryId in products table
CREATE INDEX `idx_product_category` ON `products` (`categoryId`);

-- Populate categories table with initial data
INSERT INTO `categories` (`name`, `description`, `status`) VALUES
('Electronics', 'Electronic devices and gadgets including computers, phones, and accessories', 'active'),
('Furniture', 'Office and home furniture including desks, chairs, and storage solutions', 'active'),
('Books', 'Books, magazines, and educational materials', 'active'),
('Clothing', 'Apparel and fashion items for all ages', 'active'),
('Sports', 'Sports equipment, fitness gear, and outdoor accessories', 'active'),
('Home & Garden', 'Home improvement, gardening tools, and household items', 'inactive'),
('Toys & Games', 'Children toys, board games, and entertainment products', 'active'),
('Food & Beverages', 'Food items, drinks, and kitchen supplies', 'active');

-- Update existing products to use category IDs based on their category names
UPDATE `products` SET `categoryId` = 1 WHERE `category` = 'Electronics';
UPDATE `products` SET `categoryId` = 2 WHERE `category` = 'Furniture';
UPDATE `products` SET `categoryId` = 5 WHERE `category` = 'Sports';
UPDATE `products` SET `categoryId` = 6 WHERE `category` = 'Home & Garden';

-- Drop the old category column (optional - you might want to keep it temporarily)
-- ALTER TABLE `products` DROP COLUMN `category`;