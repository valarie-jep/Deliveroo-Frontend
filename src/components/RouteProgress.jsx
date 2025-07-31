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

const RouteProgress = ({ parcel, isDemoMode = false }) => {
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

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending':
        return 'Parcel is being prepared for pickup';
      case 'in_transit':
        return 'Parcel is on its way to destination';
      case 'delivered':
        return 'Parcel has been successfully delivered';
      case 'cancelled':
        return 'Parcel delivery has been cancelled';
      default:
        return 'Status unknown';
    }
  };

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

  const steps = [
    { id: 'pending', label: 'Pending', icon: <PackageIcon />, description: 'Parcel prepared' },
    { id: 'in_transit', label: 'In Transit', icon: <TruckIcon />, description: 'On the way' },
    { id: 'delivered', label: 'Delivered', icon: <CheckIcon />, description: 'Completed' }
  ];

  const getCurrentStepIndex = () => {
    switch (parcel.status) {
      case 'pending':
        return 0;
      case 'in_transit':
        return 1;
      case 'delivered':
        return 2;
      default:
        return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Journey Progress</h3>
        <p className="text-sm text-gray-600 mt-1">
          Track your parcel's journey from pickup to delivery
        </p>
      </div>
      
      <div className="p-4">
        {/* Current Status */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-2xl text-gray-600">
              {getStatusIcon(parcel.status)}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {parcel.status.replace('_', ' ').toUpperCase()}
              </h4>
              <p className="text-sm text-gray-600">
                {getStatusDescription(parcel.status)}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  isDemoMode ? 'animate-pulse-slow' : ''
                }`}
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, #${getStatusColor(parcel.status)}-500, #${getStatusColor(parcel.status)}-400)`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Estimated Arrival */}
        {parcel.status !== 'delivered' && estimatedArrival && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">
                  Estimated Arrival
                </span>
              </div>
              <span className="text-sm font-bold text-blue-900">
                {timeRemaining}
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Expected by {new Date(estimatedArrival).toLocaleDateString()} at {new Date(estimatedArrival).toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            
            return (
              <div 
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-50 border border-green-200' 
                    : isCurrent 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg text-gray-600">
                      {step.icon}
                    </div>
                    <h4 className={`text-sm font-medium ${
                      isCompleted 
                        ? 'text-green-800' 
                        : isCurrent 
                          ? 'text-blue-800' 
                          : 'text-gray-600'
                    }`}>
                      {step.label}
                    </h4>
                  </div>
                  <p className={`text-xs ${
                    isCompleted 
                      ? 'text-green-600' 
                      : isCurrent 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {isCurrent && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Additional Information</h5>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Parcel ID:</span>
              <span className="font-medium">#{parcel.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Weight:</span>
              <span className="font-medium">{parcel.weight || 'N/A'} kg</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span className="font-medium">
                {parcel.created_at ? new Date(parcel.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            {parcel.last_updated && (
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-medium">
                  {new Date(parcel.last_updated).toLocaleString()}
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
              Watch the progress bar and status indicators update in real-time!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteProgress; 