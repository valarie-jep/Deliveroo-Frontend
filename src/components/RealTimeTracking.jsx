import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trackParcel } from '../redux/parcelSlice';
import TrackingStatus from './TrackingStatus';
import { toast } from 'react-toastify';

const RealTimeTracking = ({ parcelId, autoRefresh = true, refreshInterval = 30000 }) => {
  const dispatch = useDispatch();
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const parcels = useSelector((state) => state.parcels.list);
  const loading = useSelector((state) => state.parcels.loading);
  const error = useSelector((state) => state.parcels.error);
  
  const parcel = parcels.find(p => p.id === parseInt(parcelId));

  const fetchParcelData = useCallback(async () => {
    if (!parcelId) return;
    
    try {
      setIsTracking(true);
      const result = await dispatch(trackParcel(parcelId)).unwrap();
      setLastUpdate(new Date());
      
      // Show toast for status changes
      if (result && result.status) {
        const currentStatus = result.status;
        toast.info(`Parcel ${parcelId} status: ${currentStatus.replace('_', ' ').toUpperCase()}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to track parcel:', error);
      // Don't show error toast for parcel not found - it's expected
      if (!error.includes('Parcel not found')) {
        toast.error(`Failed to track parcel: ${error}`);
      }
    } finally {
      setIsTracking(false);
    }
  }, [dispatch, parcelId]);

  // Initial fetch
  useEffect(() => {
    fetchParcelData();
  }, [fetchParcelData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !parcelId) return;

    const interval = setInterval(() => {
      fetchParcelData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchParcelData]);

  const handleManualRefresh = () => {
    fetchParcelData();
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
              {lastUpdate.toLocaleTimeString()}
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

      {/* Tracking Status */}
      <TrackingStatus parcel={parcel} />

      {/* Real-time Updates */}
      {parcel.status === 'in_transit' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">
              Real-time Updates Active
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Your parcel is in transit. We'll notify you of any status changes.
          </p>
        </div>
      )}

      {/* Estimated Delivery */}
      {parcel.status === 'in_transit' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            Estimated Delivery
          </h4>
          <p className="text-sm text-green-700">
            Your parcel is expected to arrive within 24-48 hours
          </p>
        </div>
      )}
    </div>
  );
};

export default RealTimeTracking; 