export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  price_per_day: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  image: string;
  description: string;
  features: string; // JSON string
  available: boolean;
  location: string;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: number;
  car_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: Date;
  end_date: Date;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  pickup_location: string;
  dropoff_location: string;
  special_requests?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  available?: boolean;
}

export interface CreateBookingRequest {
  car_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  pickup_location: string;
  dropoff_location: string;
  special_requests?: string;
}