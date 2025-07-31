import React from 'react';

const TrackingStatus = ({ parcel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in_transit':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const getStatusTimeline = (status) => {
    const timeline = [
      { status: 'pending', label: 'Order Placed', description: 'Your parcel has been created and is awaiting pickup' },
      { status: 'in_transit', label: 'In Transit', description: 'Your parcel is on its way to the destination' },
      { status: 'delivered', label: 'Delivered', description: 'Your parcel has been successfully delivered' }
    ];

    const currentIndex = timeline.findIndex(item => item.status === status);
    
    return timeline.map((item, index) => {
      const isCompleted = index <= currentIndex;
      const isCurrent = index === currentIndex;
      
      return (
        <div key={item.status} className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            {isCompleted ? '✓' : (index + 1)}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium ${
              isCompleted ? 'text-green-600' : 'text-gray-500'
            }`}>
              {item.label}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {item.description}
            </div>
            {isCurrent && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  {getStatusIcon(status)} Current Status
                </span>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  if (!parcel) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Parcel #{parcel.id}
          </h3>
          <p className="text-sm text-gray-500">
            Created on {(() => {
              try {
                const date = new Date(parcel.created_at);
                return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
              } catch (error) {
                return 'Invalid date';
              }
            })()}
          </p>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(parcel.status)}`}>
          {getStatusIcon(parcel.status)} {parcel.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      <div className="space-y-6">
        {/* Timeline */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Tracking Timeline</h4>
          <div className="space-y-4">
            {getStatusTimeline(parcel.status)}
          </div>
        </div>

        {/* Parcel Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Pickup Location</h5>
            <p className="text-sm text-gray-900">{parcel.pickup_location_text}</p>
            {parcel.pick_up_latitude && parcel.pick_up_longitude && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {parcel.pick_up_latitude}, {parcel.pick_up_longitude}
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Destination</h5>
            <p className="text-sm text-gray-900">{parcel.destination_location_text}</p>
            {parcel.destination_latitude && parcel.destination_longitude && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {parcel.destination_latitude}, {parcel.destination_longitude}
              </p>
            )}
          </div>

          {parcel.current_location && (
            <div className="bg-blue-50 rounded-lg p-4 md:col-span-2">
              <h5 className="text-sm font-medium text-blue-700 mb-2">Current Location</h5>
              <p className="text-sm text-blue-900">{parcel.current_location}</p>
            </div>
          )}
        </div>

        {/* Parcel Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Weight</h5>
            <p className="text-sm text-gray-900">{parcel.weight} kg</p>
          </div>
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</h5>
            <p className="text-sm text-gray-900">{parcel.description || 'N/A'}</p>
          </div>
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sender</h5>
            <p className="text-sm text-gray-900">{parcel.sender_name}</p>
          </div>
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recipient</h5>
            <p className="text-sm text-gray-900">{parcel.recipient_name}</p>
          </div>
        </div>

        {/* Cost and Distance (if available) */}
        {(parcel.cost || parcel.distance) && (
          <div className="grid grid-cols-2 gap-4">
            {parcel.cost && (
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-green-700 mb-1">Delivery Cost</h5>
                <p className="text-lg font-semibold text-green-900">${parcel.cost}</p>
              </div>
            )}
            {parcel.distance && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-purple-700 mb-1">Distance</h5>
                <p className="text-lg font-semibold text-purple-900">{parcel.distance} km</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingStatus; 