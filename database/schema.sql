-- Car Rental Database Schema
-- MySQL 8.0+
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS carrental_db;
USE carrental_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS cars;

-- Cars table
CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  seats INT NOT NULL,
  image VARCHAR(500) NOT NULL,
  description TEXT,
  features JSON,
  available BOOLEAN DEFAULT TRUE,
  location VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_category (category),
  INDEX idx_brand (brand),
  INDEX idx_price (price_per_day),
  INDEX idx_location (location),
  INDEX idx_available (available),
  INDEX idx_fuel_type (fuel_type),
  INDEX idx_transmission (transmission)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  pickup_location VARCHAR(255) NOT NULL,
  dropoff_location VARCHAR(255) NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  INDEX idx_car_id (car_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date),
  INDEX idx_customer_email (customer_email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create view for car availability
CREATE OR REPLACE VIEW car_availability AS
SELECT
  c.*,
  CASE
    WHEN c.available = FALSE THEN 'unavailable'
    WHEN EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.car_id = c.id
      AND b.status IN ('confirmed', 'pending')
      AND b.start_date <= CURDATE()
      AND b.end_date >= CURDATE()
    ) THEN 'rented'
    ELSE 'available'
  END AS availability_status
FROM cars c;

-- Show database structure
SHOW TABLES;
DESCRIBE cars;
DESCRIBE bookings;