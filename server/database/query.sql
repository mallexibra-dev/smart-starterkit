-- =====================================================
-- SMART STARTERKIT DATABASE SCHEMA
-- =====================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS smart_starterkit;
USE smart_starterkit;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS users;

-- =====================================================
-- USERS TABLE (Basic User Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_last_login_at (last_login_at),
    INDEX idx_deleted_at (deleted_at),

    -- Composite indexes for common queries
    INDEX idx_role_status (role, status),
    INDEX idx_status_active (status, deleted_at),

    -- Full-text search index for user names
    FULLTEXT INDEX idx_search (name)
);

-- =====================================================
-- SAMPLE USERS DATA
-- =====================================================

-- Insert admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password_hash, role, status, email_verified_at) VALUES
('Admin User', 'admin@smartstarterkit.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjuZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz', 'admin', 'active', NOW()),
('Demo User', 'demo@smartstarterkit.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjuZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz', 'user', 'active', NOW());

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional performance indexes can be added here as needed
-- based on specific application requirements