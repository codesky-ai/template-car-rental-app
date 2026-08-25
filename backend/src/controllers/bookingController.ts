import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { Booking, ApiResponse, CreateBookingRequest } from '../models';

// Get all bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, car_id, customer_name, customer_email, customer_phone,
        start_date, end_date, total_price, status, pickup_location,
        dropoff_location, special_requests, created_at, updated_at
      FROM bookings
      ORDER BY created_at DESC`
    );

    const response: ApiResponse<Booking[]> = {
      success: true,
      data: rows as Booking[]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    const response: ApiResponse<Booking[]> = {
      success: false,
      error: 'Failed to fetch bookings'
    };
    res.status(500).json(response);
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, car_id, customer_name, customer_email, customer_phone,
        start_date, end_date, total_price, status, pickup_location,
        dropoff_location, special_requests, created_at, updated_at
      FROM bookings
      WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Booking not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Booking> = {
      success: true,
      data: rows[0] as Booking
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching booking:', error);
    const response: ApiResponse<Booking> = {
      success: false,
      error: 'Failed to fetch booking'
    };
    res.status(500).json(response);
  }
};

// Create new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const bookingData: CreateBookingRequest = req.body;

    // Validate required fields
    const requiredFields = [
      'car_id', 'customer_name', 'customer_email', 'customer_phone',
      'start_date', 'end_date', 'total_price', 'pickup_location', 'dropoff_location'
    ];

    for (const field of requiredFields) {
      if (!bookingData[field as keyof CreateBookingRequest]) {
        const response: ApiResponse<Booking> = {
          success: false,
          error: `${field} is required`
        };
        return res.status(400).json(response);
      }
    }

    // Check if car exists and is available
    const [carRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, available FROM cars WHERE id = ?',
      [bookingData.car_id]
    );

    if (carRows.length === 0) {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Car not found'
      };
      return res.status(404).json(response);
    }

    if (!carRows[0].available) {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Car is not available'
      };
      return res.status(400).json(response);
    }

    // Check if car is available for the requested dates
    const [conflictRows] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM bookings
       WHERE car_id = ?
       AND status IN ('confirmed', 'pending')
       AND NOT (end_date <= ? OR start_date >= ?)`,
      [bookingData.car_id, bookingData.start_date, bookingData.end_date]
    );

    if (conflictRows.length > 0) {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Car is not available for the selected dates'
      };
      return res.status(400).json(response);
    }

    // Insert new booking
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO bookings (
        car_id, customer_name, customer_email, customer_phone,
        start_date, end_date, total_price, status, pickup_location,
        dropoff_location, special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingData.car_id,
        bookingData.customer_name,
        bookingData.customer_email,
        bookingData.customer_phone,
        bookingData.start_date,
        bookingData.end_date,
        bookingData.total_price,
        bookingData.status || 'pending',
        bookingData.pickup_location,
        bookingData.dropoff_location,
        bookingData.special_requests || null
      ]
    );

    // Fetch the created booking
    const [newBookingRows] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, car_id, customer_name, customer_email, customer_phone,
        start_date, end_date, total_price, status, pickup_location,
        dropoff_location, special_requests, created_at, updated_at
      FROM bookings
      WHERE id = ?`,
      [result.insertId]
    );

    const response: ApiResponse<Booking> = {
      success: true,
      data: newBookingRows[0] as Booking,
      message: 'Booking created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating booking:', error);
    const response: ApiResponse<Booking> = {
      success: false,
      error: 'Failed to create booking'
    };
    res.status(500).json(response);
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Valid status is required (pending, confirmed, cancelled, completed)'
      };
      return res.status(400).json(response);
    }

    // Check if booking exists
    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM bookings WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Booking not found'
      };
      return res.status(404).json(response);
    }

    // Update booking status
    await pool.query(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // Fetch updated booking
    const [updatedRows] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, car_id, customer_name, customer_email, customer_phone,
        start_date, end_date, total_price, status, pickup_location,
        dropoff_location, special_requests, created_at, updated_at
      FROM bookings
      WHERE id = ?`,
      [id]
    );

    const response: ApiResponse<Booking> = {
      success: true,
      data: updatedRows[0] as Booking,
      message: 'Booking status updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating booking status:', error);
    const response: ApiResponse<Booking> = {
      success: false,
      error: 'Failed to update booking status'
    };
    res.status(500).json(response);
  }
};

// Cancel booking
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if booking exists and can be cancelled
    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, status FROM bookings WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Booking not found'
      };
      return res.status(404).json(response);
    }

    if (existingRows[0].status === 'completed') {
      const response: ApiResponse<Booking> = {
        success: false,
        error: 'Cannot cancel a completed booking'
      };
      return res.status(400).json(response);
    }

    // Update booking status to cancelled
    await pool.query(
      'UPDATE bookings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    const response: ApiResponse<Booking> = {
      success: true,
      message: 'Booking cancelled successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    const response: ApiResponse<Booking> = {
      success: false,
      error: 'Failed to cancel booking'
    };
    res.status(500).json(response);
  }
};