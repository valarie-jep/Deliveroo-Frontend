import React from 'react';
import { calculateProgressPercentage, calculateEstimatedArrival, formatTimeRemaining } from '../utils/distanceCalculator';

// SVG Icons
const PackageIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const StopIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
  </svg>
);

const JourneyMetrics = ({ parcel, isDemoMode = false }) => {
  if (!parcel) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <p className="text-gray-500 text-center">No parcel data available</p>
      </div>
    );
  }

  const progress = calculateProgressPercentage(parcel);
  const estimatedArrival = calculateEstimatedArrival(parcel);
  const timeRemaining = formatTimeRemaining(estimatedArrival);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'in_transit':
        return 'blue';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PackageIcon />;
      case 'in_transit':
        return <TruckIcon />;
      case 'delivered':
        return <CheckIcon />;
      case 'cancelled':
        return <StopIcon />;
      default:
        return <ClockIcon />;
    }
  };

  const getDistance = () => {
    // This would typically come from the backend
    // For demo purposes, we'll use a placeholder
    return '25.5 km';
  };

  const getTotalTime = () => {
    // This would typically be calculated based on actual journey time
    // For demo purposes, we'll use a placeholder
    return '2 hours 30 minutes';
  };

  const getRemainingDistance = () => {
    const totalDistance = 25.5; // km
    const remainingPercentage = (100 - progress) / 100;
    return `${(totalDistance * remainingPercentage).toFixed(1)} km`;
  };

  const getRemainingTime = () => {
    if (parcel.status === 'delivered') return '0 minutes';
    if (!estimatedArrival) return 'Calculating...';
    return timeRemaining;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Journey Metrics</h3>
        <p className="text-sm text-gray-600 mt-1">
          Key metrics and statistics for your parcel journey
        </p>
      </div>
      
      <div className="p-4">
        {/* Current Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl text-gray-600">
                {getStatusIcon(parcel.status)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {parcel.status.replace('_', ' ').toUpperCase()}
                </h4>
                <p className="text-sm text-gray-600">
                  {parcel.current_location || 'Location not specified'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-${getStatusColor(parcel.status)}-500`}>
              {progress}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Journey Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                isDemoMode ? 'animate-pulse-slow' : ''
              }`}
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #${getStatusColor(parcel.status)}-500, #${getStatusColor(parcel.status)}-400)`
              }}
            ></div>
            {/* Progress animation for in-transit parcels */}
            {parcel.status === 'in_transit' && progress > 0 && (
              <div 
                className="absolute top-0 h-3 w-3 bg-white rounded-full animate-pulse opacity-75"
                style={{ 
                  left: `${progress}%`, 
                  transform: 'translateX(-50%)' 
                }}
              ></div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Distance */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-800">Total Distance</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{getDistance()}</p>
          </div>

          {/* Total Time */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-800">Total Time</span>
            </div>
            <p className="text-lg font-bold text-green-900">{getTotalTime()}</p>
          </div>

          {/* Remaining Distance */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs font-medium text-orange-800">Remaining Distance</span>
            </div>
            <p className="text-lg font-bold text-orange-900">{getRemainingDistance()}</p>
          </div>

          {/* Remaining Time */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs font-medium text-purple-800">Remaining Time</span>
            </div>
            <p className="text-lg font-bold text-purple-900">{getRemainingTime()}</p>
          </div>
        </div>

        {/* Estimated Arrival */}
        {parcel.status !== 'delivered' && estimatedArrival && (
          <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-indigo-800">
                  Estimated Arrival
                </span>
              </div>
              <span className="text-sm font-bold text-indigo-900">
                {timeRemaining}
              </span>
            </div>
            <p className="text-xs text-indigo-600 mt-1">
              Expected by {(() => {
                try {
                  const date = new Date(estimatedArrival);
                  return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
                } catch (error) {
                  return 'Invalid date';
                }
              })()} at {(() => {
                try {
                  const date = new Date(estimatedArrival);
                  return isNaN(date.getTime()) ? 'Invalid time' : date.toLocaleTimeString();
                } catch (error) {
                  return 'Invalid time';
                }
              })()}
            </p>
          </div>
        )}

        {/* Journey Details */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Journey Details</h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Location:</span>
              <span className="font-medium text-gray-900">{parcel.pickup_location_text || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Destination:</span>
              <span className="font-medium text-gray-900">{parcel.destination_location_text || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium text-gray-900">{parcel.weight || 'N/A'} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium text-gray-900">
                {(() => {
                  try {
                    if (!parcel.created_at) return 'N/A';
                    const date = new Date(parcel.created_at);
                    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
                  } catch (error) {
                    return 'Invalid date';
                  }
                })()}
              </span>
            </div>
            {parcel.last_updated && (
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">
                  {(() => {
                    try {
                      const date = new Date(parcel.last_updated);
                      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
                    } catch (error) {
                      return 'Invalid date';
                    }
                  })()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-purple-800">Demo Mode Active</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Watch the metrics and progress bar update in real-time!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyMetrics; 