-- Car Rental Sample Data
-- Run: mysql -u root -p carrental_db < seed.sql

USE carrental_db;

-- Clear existing data
DELETE FROM bookings;
DELETE FROM cars;

-- Reset auto-increment
ALTER TABLE cars AUTO_INCREMENT = 1;
ALTER TABLE bookings AUTO_INCREMENT = 1;

-- Insert sample cars with real Unsplash images
INSERT INTO cars (name, brand, model, year, category, price_per_day, fuel_type, transmission, seats, image, description, features, available, location) VALUES

-- Economy Cars
('Toyota Camry 2023', 'Toyota', 'Camry', 2023, 'Economy', 45.00, 'Hybrid', 'Automatic', 5, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'Reliable and fuel-efficient sedan perfect for business trips and daily commuting.', '["Bluetooth", "Backup Camera", "Cruise Control", "Apple CarPlay"]', TRUE, 'Downtown'),

('Honda Civic 2023', 'Honda', 'Civic', 2023, 'Compact', 35.00, 'Gasoline', 'CVT', 5, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400', 'Efficient and reliable compact car ideal for city driving.', '["Honda Sensing", "Touchscreen", "Fuel Efficient", "Spacious Interior"]', TRUE, 'City Center'),

('Nissan Sentra 2023', 'Nissan', 'Sentra', 2023, 'Economy', 38.00, 'Gasoline', 'Automatic', 5, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'Comfortable and affordable sedan with modern technology.', '["Automatic Emergency Braking", "Blind Spot Warning", "Rear Cross Traffic Alert", "USB Ports"]', TRUE, 'Airport'),

-- Luxury Cars
('BMW X5 2023', 'BMW', 'X5', 2023, 'Luxury', 125.00, 'Gasoline', 'Automatic', 7, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'Premium luxury SUV with advanced features and exceptional comfort.', '["Leather Seats", "Navigation", "Premium Audio", "Panoramic Sunroof"]', TRUE, 'Airport'),

('Mercedes-Benz C-Class 2023', 'Mercedes-Benz', 'C-Class', 2023, 'Luxury', 110.00, 'Gasoline', 'Automatic', 5, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400', 'Elegant luxury sedan with premium comfort and advanced safety features.', '["MBUX Infotainment", "LED Headlights", "Premium Interior", "Driver Assistance"]', FALSE, 'Luxury Hub'),

('Audi Q7 2023', 'Audi', 'Q7', 2023, 'Luxury', 140.00, 'Gasoline', 'Automatic', 7, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400', 'Premium luxury SUV with three rows and advanced technology.', '["Virtual Cockpit", "Quattro AWD", "Prestige Package", "Bang & Olufsen Audio"]', TRUE, 'Premium Lot'),

-- Sports Cars
('Ford Mustang 2023', 'Ford', 'Mustang', 2023, 'Sports', 85.00, 'Gasoline', 'Manual', 4, 'https://images.unsplash.com/photo-1547744152-14d985cb937e?w=400', 'Iconic American muscle car delivering thrilling performance and style.', '["Sport Mode", "Premium Sound", "Performance Tires", "Racing Stripes"]', TRUE, 'Downtown'),

('Chevrolet Camaro 2023', 'Chevrolet', 'Camaro', 2023, 'Sports', 90.00, 'Gasoline', 'Automatic', 4, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', 'Powerful sports car with aggressive styling and thrilling performance.', '["Brembo Brakes", "Sport Suspension", "Performance Exhaust", "Track Mode"]', TRUE, 'Downtown'),

-- SUVs
('Jeep Wrangler 2023', 'Jeep', 'Wrangler', 2023, 'SUV', 75.00, 'Gasoline', 'Automatic', 5, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400', 'Rugged off-road capable SUV perfect for adventure seekers.', '["4WD", "Removable Roof", "Skid Plates", "Rock Rails"]', TRUE, 'Adventure Center'),

('Toyota RAV4 2023', 'Toyota', 'RAV4', 2023, 'SUV', 65.00, 'Hybrid', 'Automatic', 5, 'https://images.unsplash.com/photo-1511527844068-006b95d162c2?w=400', 'Versatile compact SUV with excellent fuel economy and reliability.', '["All-Wheel Drive", "Toyota Safety Sense", "Cargo Space", "Ground Clearance"]', TRUE, 'City Center'),

('Ford Explorer 2023', 'Ford', 'Explorer', 2023, 'SUV', 80.00, 'Gasoline', 'Automatic', 7, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', 'Spacious three-row SUV perfect for family trips and group travel.', '["3rd Row Seating", "SYNC 4", "Terrain Management", "Tow Package"]', TRUE, 'Airport'),

-- Electric Cars
('Tesla Model 3 2023', 'Tesla', 'Model 3', 2023, 'Electric', 95.00, 'Electric', 'Automatic', 5, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400', 'Revolutionary electric sedan with autopilot and cutting-edge technology.', '["Autopilot", "Supercharger Access", "Premium Connectivity", "Glass Roof"]', TRUE, 'Tech District'),

('Tesla Model Y 2023', 'Tesla', 'Model Y', 2023, 'Electric', 105.00, 'Electric', 'Automatic', 7, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400', 'Compact electric SUV with impressive range and advanced features.', '["Full Self Driving", "Over-the-Air Updates", "Falcon Wing Doors", "Autopilot"]', TRUE, 'Tech District'),

-- Luxury Sedans
('BMW 7 Series 2023', 'BMW', '7 Series', 2023, 'Luxury', 150.00, 'Gasoline', 'Automatic', 5, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'Flagship luxury sedan with unparalleled comfort and technology.', '["Massage Seats", "Night Vision", "Gesture Control", "Crystal Gear Selector"]', TRUE, 'Premium Lot'),

('Lexus LS 2023', 'Lexus', 'LS', 2023, 'Luxury', 135.00, 'Hybrid', 'Automatic', 5, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400', 'Premium luxury sedan with Japanese craftsmanship and hybrid efficiency.', '["Mark Levinson Audio", "Air Suspension", "Heated/Cooled Seats", "Semi-Aniline Leather"]', TRUE, 'Luxury Hub');

-- Insert sample bookings
INSERT INTO bookings (car_id, customer_name, customer_email, customer_phone, start_date, end_date, total_price, status, pickup_location, dropoff_location, special_requests) VALUES

(1, 'John Smith', 'john.smith@email.com', '+1-555-0123', '2023-12-01', '2023-12-05', 180.00, 'confirmed', 'Downtown', 'Downtown', 'GPS navigation needed'),

(3, 'Emily Johnson', 'emily.johnson@email.com', '+1-555-0234', '2023-12-10', '2023-12-12', 76.00, 'pending', 'Airport', 'City Center', 'Child seat required'),

(7, 'Michael Brown', 'michael.brown@email.com', '+1-555-0345', '2023-12-15', '2023-12-18', 255.00, 'confirmed', 'Downtown', 'Downtown', 'Performance driving experience'),

(4, 'Sarah Davis', 'sarah.davis@email.com', '+1-555-0456', '2023-12-20', '2023-12-22', 250.00, 'pending', 'Airport', 'Luxury Hub', 'Airport pickup service'),

(12, 'David Wilson', 'david.wilson@email.com', '+1-555-0567', '2024-01-05', '2024-01-08', 315.00, 'confirmed', 'Tech District', 'Tech District', 'Supercharger locations map');

-- Display inserted data summary
SELECT 'CARS SUMMARY' as '';
SELECT
    category,
    COUNT(*) as count,
    AVG(price_per_day) as avg_price,
    MIN(price_per_day) as min_price,
    MAX(price_per_day) as max_price
FROM cars
GROUP BY category
ORDER BY avg_price DESC;

SELECT 'BOOKINGS SUMMARY' as '';
SELECT
    status,
    COUNT(*) as count,
    AVG(total_price) as avg_total,
    SUM(total_price) as total_revenue
FROM bookings
GROUP BY status;

SELECT 'LOCATIONS' as '';
SELECT DISTINCT location FROM cars ORDER BY location;

SELECT 'TOTAL COUNTS' as '';
SELECT
    (SELECT COUNT(*) FROM cars) as total_cars,
    (SELECT COUNT(*) FROM cars WHERE available = TRUE) as available_cars,
    (SELECT COUNT(*) FROM bookings) as total_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings;