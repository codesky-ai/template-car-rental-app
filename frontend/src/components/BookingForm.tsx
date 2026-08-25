import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Mail, Phone, CreditCard } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Car, Booking } from '../types';

const BookingForm: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    start_date: '',
    end_date: '',
    pickup_location: '',
    dropoff_location: '',
    special_requests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (carId) {
      loadCarDetails(carId);
    }
  }, [carId]);

  const loadCarDetails = async (id: string) => {
    try {
      const carData = await apiService.getCarById(id);
      setCar(carData);
      if (carData) {
        setFormData(prev => ({
          ...prev,
          pickup_location: carData.location,
          dropoff_location: carData.location
        }));
      }
    } catch (error) {
      console.error('Error loading car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email is invalid';
    }
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (formData.start_date && formData.end_date <= formData.start_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    if (!formData.pickup_location.trim()) {
      newErrors.pickup_location = 'Pickup location is required';
    }
    if (!formData.dropoff_location.trim()) {
      newErrors.dropoff_location = 'Dropoff location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!car || !formData.start_date || !formData.end_date) return 0;

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    return days * car.price_per_day;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!car || !validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'> = {
        car_id: car.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_price: calculateTotal(),
        status: 'pending',
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        special_requests: formData.special_requests || undefined
      };

      const booking = await apiService.createBooking(bookingData);

      // Show success message and redirect
      alert(`Booking confirmed! Your booking ID is: ${booking.id}`);
      navigate('/cars');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('There was an error creating your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car || !car.available) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {!car ? 'Car Not Found' : 'Car Not Available'}
          </h2>
          <p className="text-gray-600 mb-6">
            {!car ? "The car you're trying to book doesn't exist." : 'This car is currently not available for booking.'}
          </p>
          <Link
            to="/cars"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Available Cars
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to={`/cars/${car.id}`}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Car Details</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book {car.name}</h1>
          <p className="mt-2 text-gray-600">Complete your booking details</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>

              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.customer_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="customer_email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.customer_email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="customer_phone"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                </div>
              </div>

              {/* Rental Dates */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Rental Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.start_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      min={formData.start_date || new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.end_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                  </div>
                </div>
              </div>

              {/* Pickup/Dropoff */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Pickup & Dropoff
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pickup_location" className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location *
                    </label>
                    <input
                      type="text"
                      id="pickup_location"
                      name="pickup_location"
                      value={formData.pickup_location}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.pickup_location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter pickup location"
                    />
                    {errors.pickup_location && <p className="text-red-500 text-sm mt-1">{errors.pickup_location}</p>}
                  </div>
                  <div>
                    <label htmlFor="dropoff_location" className="block text-sm font-medium text-gray-700 mb-1">
                      Dropoff Location *
                    </label>
                    <input
                      type="text"
                      id="dropoff_location"
                      name="dropoff_location"
                      value={formData.dropoff_location}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.dropoff_location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter dropoff location"
                    />
                    {errors.dropoff_location && <p className="text-red-500 text-sm mt-1">{errors.dropoff_location}</p>}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-8">
                <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  rows={3}
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special requests or requirements..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {submitting ? 'Processing...' : `Confirm Booking - $${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>

              {/* Car Info */}
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-16 h-12 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{car.name}</h3>
                  <p className="text-sm text-gray-600">{car.category}</p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Rate per day:</span>
                    <span>${car.price_per_day}</span>
                  </div>
                  {formData.start_date && formData.end_date && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Number of days:</span>
                        <span>
                          {Math.max(1, Math.ceil(
                            (new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24)
                          ))}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-green-600">${totalPrice}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 mt-4 space-y-1">
                <p>• Free cancellation up to 24 hours before pickup</p>
                <p>• All rentals include basic insurance coverage</p>
                <p>• Valid driver's license required</p>
                <p>• Additional fees may apply for extra services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;