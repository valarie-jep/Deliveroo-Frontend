import React from 'react';
import { FaMapMarkerAlt, FaUser, FaPhoneAlt, FaBox, FaClock, FaMapPin } from 'react-icons/fa';
import { useSelector } from 'react-redux';



const ParcelCard = ({ parcel }) => {
  const { user } = useSelector((state) => state.auth);

  const handleCancel = (id) => {
    console.log("Cancel Parcel:", id);
  };

  const handleChangeDestination = (id) => {
    console.log("Change destination for Parcel:", id);
  };

  const handleUpdateStatus = (id) => {
    console.log("Update status for Parcel:", id);
  };

  const handleUpdateLocation = (id) => {
    console.log("Update location for Parcel:", id);
  };
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
        <div className="mt-4 flex gap-3 flex-wrap">
        {/* Cancel & Change Destination - only if not delivered and owned by user */}
        {user && parcel.status !== 'delivered' && parcel.user_id === user.id && (
          <>
            <button
              className="px-4 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={() => handleCancel(parcel.id)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              onClick={() => handleChangeDestination(parcel.id)}
            >
              Change Destination
            </button>
          </>
        )}

        {/* Admin-only actions */}
        {user?.admin && (
          <>
            <button
              className="px-4 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              onClick={() => handleUpdateStatus(parcel.id)}
            >
              Update Status
            </button>
            <button
              className="px-4 py-1 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
              onClick={() => handleUpdateLocation(parcel.id)}
            >
              Update Location
            </button>
          </>
        )}
      </div>
  

      </div>
    </div>
  );
};

export default ParcelCard;
