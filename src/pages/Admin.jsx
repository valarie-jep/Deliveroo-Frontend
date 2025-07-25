import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Admin = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-700 mb-8">Welcome, Admin! Here you can manage users, parcels, and view analytics.</p>
        {/* Add more admin features/components here */}
      </div>
      <Footer />
    </div>
  );
};

export default Admin; 