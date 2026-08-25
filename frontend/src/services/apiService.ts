import apiClient from '../api/client';
import { mockData } from '../api/mockData';
import { Car, Booking, SearchFilters, ApiResponse } from '../types';

const USE_MOCK_DATA = false; // Toggle for development

export const apiService = {
  // Cars API
  async getCars(): Promise<Car[]> {
    if (USE_MOCK_DATA) return mockData.cars;
    try {
      const response = await apiClient.get<ApiResponse<Car[]>>('/cars');
      return response.data.data;
    } catch (error) {
      console.warn('Cars API failed, using mock data:', error);
      return mockData.cars;
    }
  },

  async getCarById(id: string): Promise<Car | null> {
    if (USE_MOCK_DATA) {
      return mockData.cars.find(car => car.id === id) || null;
    }
    try {
      const response = await apiClient.get<ApiResponse<Car>>(`/cars/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn(`Car ${id} API failed, using mock data:`, error);
      return mockData.cars.find(car => car.id === id) || null;
    }
  },

  async searchCars(filters: SearchFilters): Promise<Car[]> {
    if (USE_MOCK_DATA) {
      return this.filterCarsLocally(mockData.cars, filters);
    }
    try {
      const response = await apiClient.get<ApiResponse<Car[]>>('/cars/search', { params: filters });
      return response.data.data;
    } catch (error) {
      console.warn('Cars search API failed, using mock data:', error);
      return this.filterCarsLocally(mockData.cars, filters);
    }
  },

  // Bookings API
  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    if (USE_MOCK_DATA) {
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newBooking;
    }
    try {
      const response = await apiClient.post<ApiResponse<Booking>>('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      console.warn('Create booking API failed, using mock response:', error);
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newBooking;
    }
  },

  async getBookings(): Promise<Booking[]> {
    if (USE_MOCK_DATA) return mockData.bookings;
    try {
      const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings');
      return response.data.data;
    } catch (error) {
      console.warn('Bookings API failed, using mock data:', error);
      return mockData.bookings;
    }
  },

  // Categories and Locations
  async getCategories(): Promise<string[]> {
    if (USE_MOCK_DATA) return mockData.categories;
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/categories');
      return response.data.data;
    } catch (error) {
      console.warn('Categories API failed, using mock data:', error);
      return mockData.categories;
    }
  },

  async getLocations(): Promise<string[]> {
    if (USE_MOCK_DATA) return mockData.locations;
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/locations');
      return response.data.data;
    } catch (error) {
      console.warn('Locations API failed, using mock data:', error);
      return mockData.locations;
    }
  },

  // Helper function for local filtering
  filterCarsLocally(cars: Car[], filters: SearchFilters): Car[] {
    return cars.filter(car => {
      if (filters.category && car.category !== filters.category) return false;
      if (filters.minPrice && car.price_per_day < filters.minPrice) return false;
      if (filters.maxPrice && car.price_per_day > filters.maxPrice) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.fuelType && car.fuel_type !== filters.fuelType) return false;
      if (filters.seats && car.seats < filters.seats) return false;
      if (filters.location && car.location !== filters.location) return false;
      return true;
    });
  }
};