import React from 'react';
import { calculateProgressPercentage, formatTimeRemaining, calculateEstimatedArrival } from '../utils/distanceCalculator';

const RouteProgress = ({ parcel }) => {
  const getProgressPercentage = (status) => {
    return calculateProgressPercentage(status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_transit':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
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
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Processing';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '📦';
      case 'in_transit':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending':
        return 'Your parcel is ready for pickup';
      case 'in_transit':
        return 'Your parcel is on its way to destination';
      case 'delivered':
        return 'Your parcel has been successfully delivered';
      case 'cancelled':
        return 'Your parcel delivery has been cancelled';
      default:
        return 'Processing your parcel';
    }
  };

  const progress = getProgressPercentage(parcel.status);
  const statusColor = getStatusColor(parcel.status);
  const statusText = getStatusText(parcel.status);
  const statusIcon = getStatusIcon(parcel.status);
  const statusDescription = getStatusDescription(parcel.status);
  const estimatedArrival = calculateEstimatedArrival(parcel);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{statusIcon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{statusText}</h3>
            <p className="text-sm text-gray-600">{statusDescription}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}>
          {progress}% Complete
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Pickup Location */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">Pickup Location</p>
            <p className="text-xs text-gray-500">{parcel.pickup_location_text || 'Location not specified'}</p>
            {parcel.created_at && (
              <p className="text-xs text-gray-400 mt-1">
                Ordered: {new Date(parcel.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Progress Line */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* In Transit Step */}
          <div className="relative">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${progress >= 50 ? 'bg-blue-500' : 'bg-gray-300'} flex items-center justify-center`}>
                {progress >= 50 && (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">In Transit</p>
                <p className="text-xs text-gray-500">
                  {progress >= 50 ? 'Parcel is on its way' : 'Waiting for pickup'}
                </p>
                {parcel.status === 'in_transit' && estimatedArrival && (
                  <p className="text-xs text-blue-600 mt-1">
                    Est. arrival: {formatTimeRemaining(estimatedArrival)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
            {progress >= 100 && (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">Destination</p>
            <p className="text-xs text-gray-500">{parcel.destination_location_text || 'Location not specified'}</p>
            {parcel.status === 'delivered' && (
              <p className="text-xs text-green-600 mt-1">
                Delivered successfully
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Journey Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${statusColor}`}
            style={{ width: `${progress}%` }}
          ></div>
          {/* Progress animation for in-transit parcels */}
          {parcel.status === 'in_transit' && progress > 0 && (
            <div className="absolute top-0 left-0 h-3 w-3 bg-white rounded-full animate-pulse opacity-75"
                 style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}></div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">Parcel ID</p>
            <p className="text-gray-600">{parcel.id}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Weight</p>
            <p className="text-gray-600">{parcel.weight || 'N/A'} kg</p>
          </div>
          {parcel.status === 'in_transit' && estimatedArrival && (
            <div className="col-span-2">
              <p className="font-medium text-gray-900">Estimated Delivery</p>
              <p className="text-blue-600">
                {estimatedArrival.toLocaleDateString()} at {estimatedArrival.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteProgress; 