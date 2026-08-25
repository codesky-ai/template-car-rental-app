# Car Rental Backend API

A RESTful API for car rental management built with Node.js, Express, TypeScript, and MySQL.

## Features

- ✅ Car management (CRUD operations)
- ✅ Booking system
- ✅ Search and filtering
- ✅ MySQL database integration
- ✅ TypeScript support
- ✅ Rate limiting
- ✅ CORS enabled
- ✅ Security middleware
- ✅ Error handling

## Prerequisites

- Node.js 16+ and npm
- MySQL 8.0+
- Git

## Installation

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=carrental_db
   ```

4. **Database setup:**
   ```bash
   # Run schema creation (from project root)
   mysql -u root -p < database/schema.sql
   
   # Insert sample data
   mysql -u root -p carrental_db < database/seed.sql
   ```

5. **Build and start:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get car by ID
- `GET /api/cars/search` - Search cars with filters
- `GET /api/categories` - Get all categories
- `GET /api/locations` - Get all locations

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

## Search Parameters

The `/api/cars/search` endpoint accepts these query parameters:

- `category` - Filter by car category
- `minPrice` - Minimum price per day
- `maxPrice` - Maximum price per day
- `transmission` - Filter by transmission type
- `fuelType` - Filter by fuel type
- `seats` - Minimum number of seats
- `location` - Filter by location
- `startDate` - Check availability from date (YYYY-MM-DD)
- `endDate` - Check availability to date (YYYY-MM-DD)

Example:
```
GET /api/cars/search?category=Luxury&minPrice=50&maxPrice=200&transmission=Automatic
```

## Request/Response Examples

### Create Booking
```json
POST /api/bookings
{
  "car_id": 1,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1-555-0123",
  "start_date": "2023-12-01",
  "end_date": "2023-12-05",
  "total_price": 200,
  "status": "pending",
  "pickup_location": "Downtown",
  "dropoff_location": "Airport",
  "special_requests": "GPS needed"
}
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## Development

- **TypeScript compilation:** `npm run build`
- **Development server:** `npm run dev`
- **Production server:** `npm start`

## Database Schema

The API uses the following main tables:
- `cars` - Car information and availability
- `bookings` - Rental bookings and customer data

See `/database/schema.sql` for complete schema definition.

## Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Input validation
- SQL injection prevention via parameterized queries

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "error": "Error description",
  "details": "Additional details (dev mode only)"
}
```

## Support

- Check database connection: `GET /api/health`
- Verify sample data: `GET /api/cars`
- Test search: `GET /api/cars/search?category=Economy`