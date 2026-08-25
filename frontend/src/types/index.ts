export interface Car {
  id: string;
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
  features: string[];
  available: boolean;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  car_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  pickup_location: string;
  dropoff_location: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
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
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}