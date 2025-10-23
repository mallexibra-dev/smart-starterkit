-- =====================================================
-- PRODUCT MANAGEMENT DATABASE SCHEMA
-- =====================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS smart_starterkit;
USE smart_starterkit;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    icon VARCHAR(100) NULL,
    color VARCHAR(20) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes
    INDEX idx_status (status),
    INDEX idx_sort_order (sort_order),
    INDEX idx_name (name),
    INDEX idx_slug (slug)
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NULL,
    status ENUM('active', 'inactive', 'draft', 'archived') NOT NULL DEFAULT 'draft',
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 0,
    weight DECIMAL(8, 2) NULL,
    dimensions VARCHAR(255) NULL,
    images JSON NULL,
    tags JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    -- Foreign key constraint
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,

    -- Indexes for performance
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_sku (sku),
    INDEX idx_name (name),
    INDEX idx_created_at (created_at),
    INDEX idx_updated_at (updated_at),
    INDEX idx_stock_quantity (stock_quantity),
    INDEX idx_deleted_at (deleted_at),

    -- Composite indexes for common queries
    INDEX idx_category_status (category_id, status),
    INDEX idx_status_stock (status, stock_quantity),
    INDEX idx_category_price (category_id, price),

    -- Full-text search index for product names and descriptions
    FULLTEXT INDEX idx_search (name, description)
);

-- =====================================================
-- SAMPLE CATEGORIES DATA
-- =====================================================

INSERT IGNORE INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Electronics', 'electronics', 'Electronic devices, gadgets, and technology products', 'laptop', 'blue', 1),
('Clothing', 'clothing', 'Apparel, fashion, and textile products', 'shirt', 'purple', 2),
('Food & Beverages', 'food', 'Food items, drinks, and consumable products', 'coffee', 'orange', 3),
('Books & Media', 'books', 'Books, audiobooks, and digital media', 'book', 'green', 4),
('Home & Garden', 'home', 'Home furniture, decor, and garden supplies', 'home', 'brown', 5),
('Sports & Outdoors', 'sports', 'Sports equipment, outdoor gear, and fitness accessories', 'basketball', 'red', 6),
('Toys & Games', 'toys', 'Children toys, games, and entertainment products', 'gamepad', 'pink', 7),
('Health & Beauty', 'health', 'Healthcare, wellness, and beauty products', 'heart', 'teal', 8),
('Automotive', 'automotive', 'Car parts, accessories, and automotive supplies', 'car', 'gray', 9),
('Other', 'other', 'Miscellaneous products that dont fit other categories', 'package', 'slate', 10);

-- =====================================================
-- SAMPLE PRODUCT DATA
-- =====================================================

-- Electronics Products
INSERT IGNORE INTO products (name, description, price, category_id, status, sku, stock_quantity, min_stock_level, weight, dimensions, images, tags) VALUES
('iPhone 15 Pro', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system', 999.99, 1, 'active', 'IPH-15-PRO-256', 45, 10, 0.219, '15.0 x 7.5 x 0.8 cm',
 '["https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=800", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800"]',
 '["smartphone", "apple", "5G", "pro-camera"]'),

('MacBook Air M3', 'Ultra-thin laptop with M3 chip, 13.6-inch Liquid Retina display', 1299.99, 1, 'active', 'MBA-M3-13-512', 28, 5, 1.24, '30.4 x 21.5 x 1.13 cm',
 '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"]',
 '["laptop", "apple", "M3", "ultrabook"]'),

('iPad Pro 12.9"', 'Professional tablet with M2 chip, 12.9-inch Liquid Retina XDR display', 1099.99, 1, 'active', 'IPD-PRO-12-128', 15, 3, 0.682, '28.1 x 21.5 x 0.6 cm',
 '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800", "https://images.unsplash.com/photo-1598928424272-9e663daa9bc2?w=800"]',
 '["tablet", "apple", "M2", "pro-display"]'),

('Sony WH-1000XM5', 'Premium noise-canceling wireless headphones with exceptional sound quality', 399.99, 1, 'active', 'SNY-WH1K-XM5', 62, 8, 0.250, null,
 '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]',
 '["headphones", "noise-canceling", "wireless", "premium"]'),

('Samsung Galaxy Watch 6', 'Smart fitness and health tracking watch with advanced sensors', 299.99, 1, 'active', 'SAM-GW6-44', 34, 10, 0.050, null,
 '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]',
 '["smartwatch", "fitness", "health", "samsung"]'),

('DJI Mini 3 Pro', 'Compact drone with 4K HDR video and 48MP photos', 759.99, 1, 'active', 'DJI-MINI3-PRO', 8, 2, 0.249, '24.8 x 14.7 x 5.5 cm folded',
 '["https://images.unsplash.com/photo-1587502536392-d71cdcf45e84?w=800"]',
 '["drone", "4K", "photography", "portable"]'),

('Nintendo Switch OLED', 'Gaming console with 7-inch OLED screen and enhanced audio', 349.99, 1, 'active', 'NSW-OLED-64', 12, 5, 0.420, '24.2 x 10.4 x 1.4 cm',
 '["https://images.unsplash.com/photo-1606144042614-b2417e99db4f?w=800"]',
 '["gaming", "console", "portable", "nintendo"]'),

('Canon EOS R6 Mark II', 'Professional mirrorless camera with 24.2MP full-frame sensor', 2499.99, 1, 'active', 'CAN-EOSR6-2', 5, 1, 0.588, '13.8 x 10.1 x 8.4 cm',
 '["https://images.unsplash.com/photo-1516035069371-29a1b242cc32?w=800"]',
 '["camera", "mirrorless", "full-frame", "professional"]');

-- Clothing Products
INSERT IGNORE INTO products (name, description, price, category_id, status, sku, stock_quantity, min_stock_level, weight, dimensions, images, tags) VALUES
('Classic Cotton T-Shirt', 'Premium 100% cotton t-shirt, comfortable and breathable', 29.99, 2, 'active', 'TSH-COT-CL-M', 120, 20, 0.180, null,
 '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]',
 '["t-shirt", "cotton", "casual", "basic"]'),

('Slim Fit Jeans', 'Modern slim fit denim jeans with stretch comfort', 79.99, 2, 'active', 'JNS-SLM-32-34', 85, 15, 0.450, null,
 '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"]',
 '["jeans", "denim", "slim-fit", "casual"]'),

('Wool Blend Coat', 'Elegant winter coat with wool blend fabric', 199.99, 2, 'active', 'COT-WOL-M-L', 25, 8, 0.850, null,
 '["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800"]',
 '["coat", "winter", "wool", "formal"]'),

('Running Shoes', 'Lightweight athletic shoes with superior cushioning', 129.99, 2, 'active', 'SHO-RUN-42', 65, 12, 0.280, null,
 '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"]',
 '["shoes", "running", "athletic", "comfortable"]'),

('Leather Belt', 'Genuine leather belt with classic buckle design', 49.99, 2, 'active', 'BLT-LTH-38-M', 95, 25, 0.150, null,
 '["https://images.unsplash.com/photo-1523042174954-4dec9e9762ea?w=800"]',
 '["belt", "leather", "accessory", "classic"]');

-- Home Products
INSERT IGNORE INTO products (name, description, price, category_id, status, sku, stock_quantity, min_stock_level, weight, dimensions, images, tags) VALUES
('Ceramic Coffee Mug', 'Handcrafted ceramic mug, 12oz capacity', 14.99, 5, 'active', 'MUG-CER-12-BL', 200, 30, 0.350, null,
 '["https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800"]',
 '["mug", "ceramic", "coffee", "handmade"]'),

('Bamboo Cutting Board', 'Eco-friendly bamboo cutting board, large size', 34.99, 5, 'active', 'BRD-BAM-LG', 75, 15, 1.200, '40 x 30 x 2 cm',
 '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"]',
 '["cutting-board", "bamboo", "kitchen", "eco-friendly"]'),

('LED Desk Lamp', 'Adjustable LED desk lamp with touch control', 44.99, 5, 'active', 'LMP-LED-DSK-W', 90, 18, 0.800, null,
 '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"]',
 '["lamp", "LED", "desk", "adjustable"]'),

('Throw Pillow Set', 'Set of 2 decorative throw pillows with removable covers', 39.99, 5, 'active', 'PIL-THR-SET-2', 110, 20, 0.600, null,
 '["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800"]',
 '["pillows", "decorative", "home", "comfort"]'),

('Wall Clock', 'Modern minimalist wall clock, silent movement', 24.99, 5, 'active', 'CLK-WAL-30-W', 140, 25, 0.400, null,
 '["https://images.unsplash.com/photo-1558618047-1dfe5d97d256?w=800"]',
 '["clock", "wall", "minimalist", "silent"]');

-- Sports Products
INSERT IGNORE INTO products (name, description, price, category_id, status, sku, stock_quantity, min_stock_level, weight, dimensions, images, tags) VALUES
('Yoga Mat', 'Non-slip exercise yoga mat with carrying strap', 29.99, 6, 'active', 'YOG-MAT-6-PK', 160, 30, 1.200, '183 x 61 x 0.6 cm',
 '["https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800"]',
 '["yoga", "exercise", "mat", "fitness"]'),

('Dumbbells Set', 'Adjustable dumbbells set from 5 to 25 lbs', 89.99, 6, 'active', 'DUM-SET-25-PR', 35, 8, 11.500, null,
 '["https://images.unsplash.com/photo-1581009146145-b5ef035c09bd?w=800"]',
 '["dumbbells", "weights", "fitness", "adjustable"]'),

('Tennis Racket', 'Professional grade tennis racket with vibration dampening', 159.99, 6, 'active', 'TEN-RCK-PRO-S', 22, 5, 0.320, null,
 '["https://images.unsplash.com/photo-1599435959098-1b6a3e0c4b9a?w=800"]',
 '["tennis", "racket", "sports", "professional"]'),

('Basketball', 'Official size indoor/outdoor basketball', 24.99, 6, 'active', 'BSK-BAL-OF-7', 85, 15, 0.620, null,
 '["https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800"]',
 '["basketball", "sports", "official", "indoor"]'),

('Resistance Bands Set', 'Set of 5 resistance bands with different strengths', 19.99, 6, 'active', 'RES-BND-SET-5', 200, 40, 0.300, null,
 '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"]',
 '["resistance-bands", "fitness", "exercise", "portable"]');

-- Books Products
INSERT IGNORE INTO products (name, description, price, category_id, status, sku, stock_quantity, min_stock_level, weight, dimensions, images, tags) VALUES
('JavaScript: The Good Parts', 'Essential guide to JavaScript programming best practices', 39.99, 4, 'active', 'BK-JS-GOOD-1', 45, 10, 0.350, '21.6 x 14.0 x 1.8 cm',
 '["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800"]',
 '["programming", "JavaScript", "technology", "education"]'),

('Clean Code', 'Handbook of agile software craftsmanship', 42.99, 4, 'active', 'BK-CLN-CODE-1', 38, 8, 0.420, '23.4 x 17.8 x 3.0 cm',
 '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"]',
 '["programming", "software", "clean-code", "development"]'),

('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', 12.99, 4, 'active', 'BK-GAT-GRT-1', 120, 25, 0.200, '19.8 x 13.0 x 1.5 cm',
 '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800"]',
 '["fiction", "classic", "literature", "American"]'),

('Sapiens', 'Brief history of humankind by Yuval Noah Harari', 18.99, 4, 'active', 'BK-SAPIENS-1', 95, 20, 0.450, '24.1 x 16.5 x 3.2 cm',
 '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"]',
 '["history", "non-fiction", "anthropology", "bestseller"]');

-- Food Products
INSERT IGNORE INTO products (name, description, price, category_id, status, sku, stock_quantity, min_stock_level, weight, dimensions, images, tags) VALUES
('Organic Honey', 'Pure raw honey from local beekeepers', 12.99, 3, 'active', 'HON-ORG-500', 85, 15, 0.500, null,
 '["https://images.unsplash.com/photo-1587049352307-6355b2bd6071?w=800"]',
 '["honey", "organic", "natural", "sweetener"]'),

('Artisan Coffee Beans', 'Premium single-origin coffee beans, medium roast', 24.99, 3, 'active', 'COF-ART-1KG', 60, 12, 1.000, null,
 '["https://images.unsplash.com/photo-1559056199-641a85e8d55c?w=800"]',
 '["coffee", "beans", "premium", "single-origin"]'),

('Extra Virgin Olive Oil', 'Cold-pressed olive oil from Mediterranean groves', 18.99, 3, 'active', 'OIL-EVO-500', 70, 18, 0.500, null,
 '["https://images.unsplash.com/photo-1532685114238-d46c2d64db2c?w=800"]',
 '["olive-oil", "Mediterranean", "cold-pressed", "cooking"]'),

('Dark Chocolate Collection', 'Assorted premium dark chocolates from Belgium', 22.99, 3, 'active', 'CHO-DRK-BOX-12', 45, 10, 0.300, null,
 '["https://images.unsplash.com/photo-1511381939415-e44015466834?w=800"]',
 '["chocolate", "dark", "premium", "Belgian"]');

-- Health Products
INSERT IGNORE INTO products (name, description, price, category_id, status, sku, stock_quantity, min_stock_level, weight, dimensions, images, tags) VALUES
('Multivitamin Complex', 'Daily comprehensive multivitamin supplement', 29.99, 8, 'active', 'VIT-MULT-60', 130, 25, 0.250, null,
 '["https://images.unsplash.com/photo-1608501058487-75a2c784952b?w=800"]',
 '["vitamins", "supplements", "daily", "health"]'),

('Protein Powder', 'Premium whey protein powder for muscle building', 44.99, 8, 'active', 'PRO-WHEY-2KG', 80, 15, 2.000, null,
 '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"]',
 '["protein", "whey", "fitness", "muscle"]'),

('Yoga Block', 'High-density foam yoga block for support and stability', 12.99, 8, 'active', 'YOG-BLK-FM-PK', 150, 30, 0.150, '23 x 15 x 7.6 cm',
 '["https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800"]',
 '["yoga", "fitness", "exercise", "support"]');

-- Add some low stock products for testing
UPDATE products SET stock_quantity = 5 WHERE name = 'iPhone 15 Pro';
UPDATE products SET stock_quantity = 3 WHERE name = 'MacBook Air M3';
UPDATE products SET stock_quantity = 8 WHERE name = 'Canon EOS R6 Mark II';

-- Add some out of stock products
UPDATE products SET stock_quantity = 0, status = 'inactive' WHERE name = 'Nintendo Switch OLED';

-- =====================================================
-- SOFT DELETE HANDLING
-- =====================================================

-- Ensure deleted_at index is properly handled (only add if doesn't exist)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = 'smart_starterkit' AND TABLE_NAME = 'products' AND INDEX_NAME = 'idx_deleted_at') = 0,
    'ALTER TABLE products ADD INDEX idx_deleted_at (deleted_at);',
    'SELECT "idx_deleted_at index already exists";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Get products with low stock (below minimum level)
-- SELECT * FROM products WHERE stock_quantity <= min_stock_level AND status = 'active' AND deleted_at IS NULL;

-- Get products by category
-- SELECT p.*, c.name as category_name, c.slug as category_slug
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE c.slug = 'electronics' AND p.status = 'active' AND p.deleted_at IS NULL
-- ORDER BY p.name;

-- Search products by name or description (using LIKE for broader compatibility)
-- SELECT p.*, c.name as category_name, c.slug as category_slug
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE (p.name LIKE '%laptop%' OR p.description LIKE '%laptop%')
--   AND p.status = 'active' AND p.deleted_at IS NULL;

-- Full-text search alternative (if FULLTEXT index is supported)
-- SELECT p.*, c.name as category_name, c.slug as category_slug
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE MATCH(p.name, p.description) AGAINST('laptop' IN NATURAL LANGUAGE MODE)
--   AND p.status = 'active' AND p.deleted_at IS NULL;

-- Get product statistics (matching ProductService.getProductStats logic)
-- SELECT
--     COUNT(*) as total_products,
--     SUM(CASE WHEN stock_quantity <= min_stock_level AND stock_quantity > 0 THEN 1 ELSE 0 END) as low_stock,
--     SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock,
--     SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
-- FROM products WHERE deleted_at IS NULL;

-- Get category statistics (matching ProductService.getCategoryStats logic)
-- SELECT
--     c.name as category_name,
--     c.slug as category_slug,
--     c.color as category_color,
--     COUNT(*) as count,
--     SUM(CASE WHEN p.stock_quantity <= p.min_stock_level AND p.stock_quantity > 0 THEN 1 ELSE 0 END) as low_stock_count,
--     SUM(p.price * p.stock_quantity) as total_value,
--     AVG(p.price) as avg_price
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- WHERE p.deleted_at IS NULL AND c.status = 'active'
-- GROUP BY c.id, c.name, c.slug, c.color
-- ORDER BY count DESC;

-- Get all active categories
-- SELECT id, name, slug, description, icon, color, sort_order
-- FROM categories
-- WHERE status = 'active'
-- ORDER BY sort_order, name;

-- =====================================================
-- DATABASE COMPLETION
-- =====================================================

-- =====================================================
-- DATABASE SETUP VERIFICATION
-- =====================================================

-- Show table structure
DESCRIBE products;

-- Show sample data
SELECT * FROM products LIMIT 5;

-- Show total products (excluding soft deletes)
SELECT COUNT(*) as total_products FROM products WHERE deleted_at IS NULL;

-- Show product statistics
SELECT
    COUNT(*) as total_products,
    SUM(CASE WHEN stock_quantity <= min_stock_level AND stock_quantity > 0 THEN 1 ELSE 0 END) as low_stock,
    SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
FROM products
WHERE deleted_at IS NULL;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================