import React from 'react';
import { 
  calculateRemainingJourney, 
  formatDistance, 
  formatTime 
} from '../utils/distanceCalculator';

const JourneyMetrics = ({ parcel }) => {
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

  const progress = getProgressPercentage(parcel.status);
  const journeyData = calculateRemainingJourney(parcel, progress);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Total Distance */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Distance</p>
              <p className="text-lg font-bold text-blue-900">
                {formatDistance(journeyData.totalDistance)}
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-green-600 font-medium">Est. Time</p>
              <p className="text-lg font-bold text-green-900">
                {formatTime(journeyData.totalTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Remaining Distance */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-orange-600 font-medium">Remaining</p>
              <p className="text-lg font-bold text-orange-900">
                {formatDistance(journeyData.remainingDistance)}
              </p>
            </div>
          </div>
        </div>

        {/* Remaining Time */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-purple-600 font-medium">Time Left</p>
              <p className="text-lg font-bold text-purple-900">
                {formatTime(journeyData.remainingTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Journey Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-green-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Journey Status */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Current Status</p>
            <p className="text-xs text-gray-600">
              {parcel.status === 'pending' && 'Ready for pickup'}
              {parcel.status === 'in_transit' && 'On the way to destination'}
              {parcel.status === 'delivered' && 'Successfully delivered'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {progress === 0 && 'Starting point'}
              {progress > 0 && progress < 100 && 'In transit'}
              {progress === 100 && 'Destination reached'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyMetrics; 