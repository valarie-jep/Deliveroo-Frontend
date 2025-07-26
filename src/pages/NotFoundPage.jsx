import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaExclamationTriangle } from 'react-icons/fa';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />

      <section className="flex flex-1 flex-col items-center justify-center text-center px-6 py-20">
        <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center text-orange-600 shadow-lg mb-6">
          <FaExclamationTriangle className="text-3xl" />
        </div>
        <h1 className="text-4xl font-bold text-orange-500 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 max-w-xl mb-6">
          Oops! The page you're looking for doesn't exist or may have been moved. But don't worry — we've got your back.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-md transition"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate('/tracking')}
            className="border border-orange-500 text-orange-500 hover:bg-orange-100 font-medium px-6 py-3 rounded-md transition"
          >
            Track a Parcel
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default NotFoundPage;
