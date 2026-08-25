# Car Rental Database

MySQL database setup for the Car Rental application.

## Prerequisites

- MySQL Server 8.0+
- MySQL client or MySQL Workbench

## Quick Setup

1. **Create Database and Schema:**
   ```bash
   mysql -u root -p < schema.sql
   ```

2. **Insert Sample Data:**
   ```bash
   mysql -u root -p carrental_db < seed.sql
   ```

3. **Verify Installation:**
   ```bash
   mysql -u root -p carrental_db
   ```
   ```sql
   SELECT COUNT(*) as total_cars FROM cars;
   SELECT COUNT(*) as total_bookings FROM bookings;
   ```

## Database Schema

### Tables

#### `cars`
Stores car information and inventory.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique car identifier |
| name | VARCHAR(255) | Full car name |
| brand | VARCHAR(100) | Car brand/manufacturer |
| model | VARCHAR(100) | Car model |
| year | INT | Manufacturing year |
| category | VARCHAR(50) | Car category (Economy, Luxury, SUV, etc.) |
| price_per_day | DECIMAL(10,2) | Daily rental price |
| fuel_type | VARCHAR(50) | Fuel type (Gasoline, Hybrid, Electric) |
| transmission | VARCHAR(50) | Transmission type |
| seats | INT | Number of seats |
| image | VARCHAR(500) | Car image URL |
| description | TEXT | Car description |
| features | JSON | Array of car features |
| available | BOOLEAN | Availability status |
| location | VARCHAR(100) | Car location |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

#### `bookings`
Stores rental bookings and customer information.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique booking identifier |
| car_id | INT (FK) | References cars.id |
| customer_name | VARCHAR(255) | Customer full name |
| customer_email | VARCHAR(255) | Customer email |
| customer_phone | VARCHAR(50) | Customer phone |
| start_date | DATE | Rental start date |
| end_date | DATE | Rental end date |
| total_price | DECIMAL(10,2) | Total booking price |
| status | ENUM | Booking status (pending, confirmed, cancelled, completed) |
| pickup_location | VARCHAR(255) | Car pickup location |
| dropoff_location | VARCHAR(255) | Car dropoff location |
| special_requests | TEXT | Customer special requests |
| created_at | TIMESTAMP | Booking creation time |
| updated_at | TIMESTAMP | Last update time |

### Indexes

Performance optimized with indexes on:
- Car category, brand, price, location, availability
- Booking status, dates, car_id, customer_email
- Composite indexes for common query patterns

### Views

#### `car_availability`
Real-time view showing car availability status:
- `available` - Car is available for rent
- `rented` - Car is currently rented
- `unavailable` - Car is marked as unavailable

## Sample Data

The seed script includes:

### Cars (15 vehicles)
- **Economy:** 3 cars ($35-45/day)
- **Compact:** 1 car ($35/day)  
- **SUV:** 3 cars ($65-80/day)
- **Luxury:** 4 cars ($110-150/day)
- **Sports:** 2 cars ($85-90/day)
- **Electric:** 2 cars ($95-105/day)

### Locations
- Downtown
- Airport  
- City Center
- Luxury Hub
- Tech District
- Adventure Center
- Premium Lot

### Bookings (5 sample bookings)
- Mix of confirmed and pending statuses
- Different date ranges and customers
- Various special requests

## Queries Examples

### Find Available Cars
```sql
SELECT * FROM cars 
WHERE available = TRUE
AND id NOT IN (
  SELECT car_id FROM bookings 
  WHERE status IN ('confirmed', 'pending')
  AND start_date <= '2023-12-15' 
  AND end_date >= '2023-12-10'
);
```

### Search by Category and Price
```sql
SELECT * FROM cars 
WHERE category = 'Luxury' 
AND price_per_day BETWEEN 100 AND 150
AND available = TRUE;
```

### Customer Booking History
```sql
SELECT b.*, c.name as car_name 
FROM bookings b
JOIN cars c ON b.car_id = c.id
WHERE b.customer_email = 'john.smith@email.com'
ORDER BY b.created_at DESC;
```

### Revenue by Category
```sql
SELECT c.category, 
       COUNT(b.id) as bookings,
       SUM(b.total_price) as total_revenue,
       AVG(b.total_price) as avg_booking
FROM bookings b
JOIN cars c ON b.car_id = c.id
WHERE b.status = 'confirmed'
GROUP BY c.category;
```

## Maintenance

### Backup
```bash
mysqldump -u root -p carrental_db > carrental_backup.sql
```

### Restore
```bash
mysql -u root -p carrental_db < carrental_backup.sql
```

### Reset Database
```bash
mysql -u root -p < schema.sql
mysql -u root -p carrental_db < seed.sql
```

## Configuration

Update your backend `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carrental_db
```

## Troubleshooting

1. **Connection Issues:**
   - Verify MySQL server is running
   - Check credentials in `.env` file
   - Ensure database `carrental_db` exists

2. **Permission Errors:**
   ```sql
   GRANT ALL PRIVILEGES ON carrental_db.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Character Set Issues:**
   ```sql
   ALTER DATABASE carrental_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## Performance Tips

- Use indexes for frequently queried columns
- Consider partitioning for large booking tables
- Regular ANALYZE TABLE for query optimization
- Monitor slow query log for performance issues