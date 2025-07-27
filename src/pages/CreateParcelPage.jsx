import React, { useState } from 'react';
import ParcelForm from '../components/ParcelForm';
import Navbar from '../components/Navbar';

const CreateParcelPage = () => {
  const [success, setSuccess] = useState(null);
  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Create New Parcel</h1>
          <ul className="mb-6 text-sm text-gray-700 w-full list-disc list-inside">
            <li><span className="font-semibold">Pickup Location</span></li>
            <li><span className="font-semibold">Destination</span></li>
            <li><span className="font-semibold">Weight (kg)</span></li>
            <li><span className="font-semibold">Create Parcel</span></li>
          </ul>
          {success && (
            <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4 w-full text-center" role="alert">
              <span className="block sm:inline font-semibold">{success}</span>
            </div>
          )}
          <ParcelForm setSuccess={setSuccess} />
        </div>
      </div>
  </div>
);
};

export default CreateParcelPage; 