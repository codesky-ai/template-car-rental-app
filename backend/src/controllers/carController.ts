import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { Car, ApiResponse, SearchFilters } from '../models';

// Get all cars
export const getAllCars = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, brand, model, year, category, price_per_day,
        fuel_type, transmission, seats, image, description,
        features, available, location, created_at, updated_at
      FROM cars
      ORDER BY created_at DESC`
    );

    // Parse features JSON string to array
    const cars = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features || '[]')
    }));

    const response: ApiResponse<Car[]> = {
      success: true,
      data: cars as Car[]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching cars:', error);
    const response: ApiResponse<Car[]> = {
      success: false,
      error: 'Failed to fetch cars'
    };
    res.status(500).json(response);
  }
};

// Get car by ID
export const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        id, name, brand, model, year, category, price_per_day,
        fuel_type, transmission, seats, image, description,
        features, available, location, created_at, updated_at
      FROM cars
      WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      const response: ApiResponse<Car> = {
        success: false,
        error: 'Car not found'
      };
      return res.status(404).json(response);
    }

    const car = {
      ...rows[0],
      features: JSON.parse(rows[0].features || '[]')
    };

    const response: ApiResponse<Car> = {
      success: true,
      data: car as Car
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching car:', error);
    const response: ApiResponse<Car> = {
      success: false,
      error: 'Failed to fetch car'
    };
    res.status(500).json(response);
  }
};

// Search cars with filters
export const searchCars = async (req: Request, res: Response) => {
  try {
    const filters: SearchFilters = req.query;

    let query = `
      SELECT
        id, name, brand, model, year, category, price_per_day,
        fuel_type, transmission, seats, image, description,
        features, available, location, created_at, updated_at
      FROM cars
      WHERE 1=1
    `;

    const queryParams: any[] = [];

    // Apply filters
    if (filters.category) {
      query += ' AND category = ?';
      queryParams.push(filters.category);
    }

    if (filters.minPrice) {
      query += ' AND price_per_day >= ?';
      queryParams.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ' AND price_per_day <= ?';
      queryParams.push(filters.maxPrice);
    }

    if (filters.transmission) {
      query += ' AND transmission = ?';
      queryParams.push(filters.transmission);
    }

    if (filters.fuelType) {
      query += ' AND fuel_type = ?';
      queryParams.push(filters.fuelType);
    }

    if (filters.seats) {
      query += ' AND seats >= ?';
      queryParams.push(filters.seats);
    }

    if (filters.location) {
      query += ' AND location = ?';
      queryParams.push(filters.location);
    }

    if (filters.available !== undefined) {
      query += ' AND available = ?';
      queryParams.push(filters.available);
    }

    // Check availability for date range if provided
    if (filters.startDate && filters.endDate) {
      query += ` AND id NOT IN (
        SELECT DISTINCT car_id FROM bookings
        WHERE status IN ('confirmed', 'pending')
        AND NOT (end_date <= ? OR start_date >= ?)
      )`;
      queryParams.push(filters.startDate, filters.endDate);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);

    // Parse features JSON string to array
    const cars = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features || '[]')
    }));

    const response: ApiResponse<Car[]> = {
      success: true,
      data: cars as Car[]
    };

    res.json(response);
  } catch (error) {
    console.error('Error searching cars:', error);
    const response: ApiResponse<Car[]> = {
      success: false,
      error: 'Failed to search cars'
    };
    res.status(500).json(response);
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT DISTINCT category FROM cars ORDER BY category'
    );

    const categories = rows.map(row => row.category);

    const response: ApiResponse<string[]> = {
      success: true,
      data: categories
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    const response: ApiResponse<string[]> = {
      success: false,
      error: 'Failed to fetch categories'
    };
    res.status(500).json(response);
  }
};

// Get all locations
export const getLocations = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT DISTINCT location FROM cars ORDER BY location'
    );

    const locations = rows.map(row => row.location);

    const response: ApiResponse<string[]> = {
      success: true,
      data: locations
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching locations:', error);
    const response: ApiResponse<string[]> = {
      success: false,
      error: 'Failed to fetch locations'
    };
    res.status(500).json(response);
  }
};