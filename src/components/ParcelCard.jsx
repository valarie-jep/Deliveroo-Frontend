import React from 'react';
import { FaMapMarkerAlt, FaUser, FaPhoneAlt, FaBox, FaClock, FaMapPin } from 'react-icons/fa';

const ParcelCard = ({ parcel }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-200 transition hover:shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-indigo-600">Parcel #{parcel.id}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            parcel.status === 'delivered'
              ? 'bg-green-100 text-green-700'
              : parcel.status === 'in-transit'
              ? 'bg-yellow-100 text-yellow-700'
              : parcel.status === 'cancelled'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {parcel.status}
        </span>
      </div>

      <div className="text-gray-800 space-y-2">
        {/* Sender */}
        <div className="flex items-center gap-2 text-sm">
          <FaUser className="text-indigo-500" />
          <span className="font-medium">{parcel.sender_name}</span> — 
          <FaPhoneAlt className="ml-2 text-gray-500" />
          <span>{parcel.sender_phone_number}</span>
        </div>

        {/* Recipient */}
        <div className="flex items-center gap-2 text-sm">
          <FaUser className="text-green-600" />
          <span className="font-medium">{parcel.recipient_name}</span> — 
          <FaPhoneAlt className="ml-2 text-gray-500" />
          <span>{parcel.recipient_phone_number}</span>
        </div>

        {/* Pickup & Destination */}
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <span className="text-gray-600">Pickup:</span>
            <span className="font-medium">{parcel.pickup_location_text}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapPin className="text-pink-500" />
            <span className="text-gray-600">Destination:</span>
            <span className="font-medium">{parcel.destination_location_text}</span>
          </div>
        </div>

        {/* Current Location */}
        {parcel.current_location && (
          <div className="flex items-center gap-2 text-sm">
            <FaMapMarkerAlt className="text-purple-500" />
            <span className="text-gray-600">Current location:</span>
            <span>{parcel.current_location}</span>
          </div>
        )}

        {/* Description & Weight */}
        <div className="flex items-center gap-2 text-sm">
          <FaBox className="text-orange-500" />
          <span className="text-gray-600">Item:</span>
          <span>{parcel.description} ({parcel.weight} kg)</span>
        </div>

        {/* Cost and Distance */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Cost:</span>
          <span className="font-medium text-green-600">KES {parcel.cost?.toFixed(2)}</span>
          <span className="text-gray-500 mx-2">|</span>
          <span className="text-gray-600">Distance:</span>
          <span className="font-medium">{parcel.distance?.toFixed(2)} km</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FaClock />
          <span>{new Date(parcel.created_at).toLocaleString()}</span>

        </div>
          

      </div>
    </div>
  );
};

export default ParcelCard;