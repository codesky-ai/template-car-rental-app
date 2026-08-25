import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Fuel, Settings, MapPin, Star } from 'lucide-react';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
            {car.category}
          </span>
        </div>
        {!car.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fuel className="h-4 w-4" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{car.location}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-green-600">
              ${car.price_per_day}
            </span>
            <span className="text-gray-500">/day</span>
          </div>
          <div className="space-x-2">
            <Link
              to={`/cars/${car.id}`}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Details
            </Link>
            <Link
              to={car.available ? `/book/${car.id}` : '#'}
              className={`px-4 py-2 rounded-lg transition-colors ${
                car.available
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {car.available ? 'Book Now' : 'Unavailable'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;