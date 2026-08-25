import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CarListings from './components/CarListings';
import CarDetails from './components/CarDetails';
import BookingForm from './components/BookingForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarListings />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/book/:carId" element={<BookingForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;