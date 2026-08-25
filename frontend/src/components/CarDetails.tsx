import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Fuel,
  Settings,
  MapPin,
  Star,
  Calendar,
  Shield,
  CheckCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { Car } from '../types';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCarDetails(id);
    }
  }, [id]);

  const loadCarDetails = async (carId: string) => {
    try {
      const carData = await apiService.getCarById(carId);
      setCar(carData);
    } catch (error) {
      console.error('Error loading car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (car && car.available) {
      navigate(`/book/${car.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h2>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist.</p>
          <Link
            to="/cars"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Other Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/cars"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cars</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {car.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-medium">4.8</span>
              <span className="text-gray-500">(124 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Image and Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-64 md:h-80 object-cover"
                />
                {!car.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                      Currently Unavailable
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Car</h2>
                <p className="text-gray-600 mb-6">{car.description}</p>

                {/* Car Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Seating</p>
                      <p className="font-semibold">{car.seats} people</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Fuel className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-semibold">{car.fuel_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-semibold">{car.transmission}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <MapPin className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-semibold">{car.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-green-600">
                  ${car.price_per_day}
                </span>
                <span className="text-gray-500 text-lg">/day</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{car.brand}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{car.model}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{car.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${car.available ? 'text-green-600' : 'text-red-600'}`}>
                    {car.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={!car.available}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  car.available
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {car.available ? 'Book This Car' : 'Not Available'}
              </button>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Fully insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Free cancellation up to 24h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Excellent customer reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;