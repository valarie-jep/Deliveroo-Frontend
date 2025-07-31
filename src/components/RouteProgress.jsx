import React from 'react';

const RouteProgress = ({ parcel }) => {
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'in_transit':
        return 50;
      case 'delivered':
        return 100;
      default:
        return 25;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_transit':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Processing';
    }
  };

  const progress = getProgressPercentage(parcel.status);
  const statusColor = getStatusColor(parcel.status);
  const statusText = getStatusText(parcel.status);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Route Progress</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
          {statusText}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Pickup Location</p>
            <p className="text-xs text-gray-500">{parcel.pickup_location_text}</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="relative">
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full ${progress >= 50 ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center`}>
                {progress >= 50 && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">In Transit</p>
                <p className="text-xs text-gray-500">Parcel is on its way</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
            {progress >= 100 && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Destination</p>
            <p className="text-xs text-gray-500">{parcel.destination_location_text}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${statusColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RouteProgress; 