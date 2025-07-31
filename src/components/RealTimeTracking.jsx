import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcels } from '../redux/parcelSlice';
import TrackingStatus from './TrackingStatus';
import { toast } from 'react-toastify';

const RealTimeTracking = ({ parcelId, autoRefresh = true, refreshInterval = 30000 }) => {
  const dispatch = useDispatch();
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  
  const parcel = useSelector((state) => 
    state.parcels.parcels.find(p => String(p.id) === String(parcelId))
  );

  const calculateEstimatedArrival = useCallback((parcel) => {
    if (!parcel || parcel.status === 'delivered') return null;
    
    const now = new Date();
    
    let estimatedHours = 48; // Default 48 hours
    
    if (parcel.status === 'in_transit') {
      estimatedHours = 24; // 24 hours remaining when in transit
    } else if (parcel.status === 'pending') {
      estimatedHours = 48; // 48 hours total for pending
    }
    
    const estimatedDate = new Date(now.getTime() + (estimatedHours * 60 * 60 * 1000));
    return estimatedDate;
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!parcelId) return;
    
    try {
      setIsTracking(true);
      setLoading(true);
      setError(null);
      await dispatch(fetchParcels()).unwrap();
      setLastUpdate(new Date());
      
      toast.success('Tracking data refreshed!', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Failed to refresh tracking:', error);
      setError('Failed to refresh tracking data');
      toast.error('Failed to refresh tracking data', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsTracking(false);
      setLoading(false);
    }
  }, [dispatch, parcelId]);

  useEffect(() => {
    if (parcelId) {
      handleRefresh();
    }
  }, [parcelId, handleRefresh]);

  useEffect(() => {
    if (!autoRefresh || !parcelId) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, handleRefresh]);

  useEffect(() => {
    if (parcel) {
      setEstimatedArrival(calculateEstimatedArrival(parcel));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parcel, calculateEstimatedArrival]);

  const handleManualRefresh = () => {
    handleRefresh();
  };

  const formatTimeRemaining = (estimatedDate) => {
    if (!estimatedDate) return 'Calculating...';
    
    const now = new Date();
    const timeDiff = estimatedDate - now;
    
    if (timeDiff <= 0) return 'Overdue';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (loading && !parcel) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Loading parcel data...</span>
      </div>
    );
  }

  if (error && !parcel) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Parcel</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleManualRefresh}
            className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Parcel Not Found</h3>
            <p className="text-sm text-yellow-700 mt-1">
              No parcel found with ID: {parcelId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tracking Header */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isTracking ? 'Live Tracking' : 'Last Updated'}
            </span>
          </div>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Last update: {(() => {
                try {
                  const date = new Date(lastUpdate);
                  return isNaN(date.getTime()) ? 'Invalid time' : date.toLocaleTimeString();
                } catch (error) {
                  return 'Invalid time';
                }
              })()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleManualRefresh}
            disabled={isTracking}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isTracking
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            {isTracking ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              autoRefresh ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-500">
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Estimated Arrival */}
      {estimatedArrival && parcel.status !== 'delivered' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">
                Estimated Arrival
              </span>
            </div>
            <span className="text-sm font-bold text-blue-900">
              {formatTimeRemaining(estimatedArrival)}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
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

      {/* Tracking Status */}
      <TrackingStatus parcel={parcel} />

      {/* Real-time Updates */}
      {parcel.status === 'in_transit' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">
              Real-time Updates Active
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your parcel is in transit. We'll notify you of any status changes.
          </p>
        </div>
      )}

      {/* Tracking History */}
      {/* The trackingHistory state was removed, so this section is no longer relevant. */}
      {/* If history is needed, it should be managed in the Redux store or passed as a prop. */}
      {/* For now, removing the section as per the edit hint. */}

      {/* Delivery Confirmation */}
      {parcel.status === 'delivered' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-800">
              Successfully Delivered!
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your parcel has been delivered to the destination.
          </p>
        </div>
      )}
    </div>
  );
};

export default RealTimeTracking; 