import { Router } from 'express';
import {
  getAllCars,
  getCarById,
  searchCars,
  getCategories,
  getLocations
} from '../controllers/carController';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Car Rental API is running',
    timestamp: new Date().toISOString()
  });
});

// Car routes
router.get('/cars', getAllCars);
router.get('/cars/search', searchCars);
router.get('/cars/:id', getCarById);
router.get('/categories', getCategories);
router.get('/locations', getLocations);

// Booking routes
router.get('/bookings', getAllBookings);
router.post('/bookings', createBooking);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', cancelBooking);

export default router;