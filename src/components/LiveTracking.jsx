import React, { useState, useEffect, useCallback } from 'react';
import trackingService from '../services/trackingService';
import { toast } from 'react-toastify';

const LiveTracking = ({ parcelId, parcel, onTrackingUpdate }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // Handle tracking updates
  const handleTrackingUpdate = useCallback((data) => {
    console.log('📡 Live tracking update received:', data);
    
    setTrackingData(data);
    setLastUpdate(new Date());
    setError(null);

    // Add to recent updates
    const update = {
      id: Date.now(),
      timestamp: new Date(),
      status: data.status,
      location: data.current_location,
      message: `Status updated to ${data.status.replace('_', ' ').toUpperCase()}`
    };

    setRecentUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates

    // Show toast notification for status changes
    if (data.status !== parcel?.status) {
      toast.info(`Parcel ${parcelId} status: ${data.status.replace('_', ' ').toUpperCase()}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Call parent callback
    if (onTrackingUpdate) {
      onTrackingUpdate(data);
    }
  }, [parcelId, parcel?.status, onTrackingUpdate]);

  // Handle tracking errors
  const handleTrackingError = useCallback((error) => {
    console.error('❌ Live tracking error:', error);
    setError(error.message);
    toast.error('Failed to update tracking data', {
      position: "top-right",
      autoClose: 3000,
    });
  }, []);

  // Start tracking
  const startTracking = useCallback(() => {
    if (!parcelId) return;

    console.log('🚀 Starting live tracking for parcel:', parcelId);
    setIsTracking(true);
    setError(null);

    trackingService.startTracking(parcelId, handleTrackingUpdate, handleTrackingError);
  }, [parcelId, handleTrackingUpdate, handleTrackingError]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (!parcelId) return;

    console.log('🛑 Stopping live tracking for parcel:', parcelId);
    setIsTracking(false);
    trackingService.stopTracking(parcelId);
  }, [parcelId]);

  // Manual refresh
  const handleManualRefresh = useCallback(async () => {
    if (!parcelId) return;

    try {
      await trackingService.refreshTracking(parcelId);
      toast.success('Tracking data refreshed', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('Failed to refresh tracking data', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [parcelId]);

  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(!autoRefresh);
    if (autoRefresh) {
      stopTracking();
    } else {
      startTracking();
    }
  }, [autoRefresh, startTracking, stopTracking]);

  // Start demo mode
  const startDemo = useCallback(() => {
    console.log('🎬 Starting demo mode');
    setIsTracking(true);
    setError(null);
    
    trackingService.startDemo(parcelId, handleTrackingUpdate);
  }, [parcelId, handleTrackingUpdate]);

  // Initialize tracking on mount
  useEffect(() => {
    if (parcelId && autoRefresh) {
      startTracking();
    }

    // Cleanup on unmount
    return () => {
      if (parcelId) {
        trackingService.stopTracking(parcelId);
      }
    };
  }, [parcelId, autoRefresh, startTracking]);

  // Update tracking data when parcel changes
  useEffect(() => {
    if (parcel) {
      setTrackingData({
        status: parcel.status,
        current_location: parcel.pickup_location_text || 'Location not specified',
        estimated_delivery: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString()
      });
    }
  }, [parcel]);

  const formatTimeRemaining = (estimatedDate) => {
    if (!estimatedDate) return 'Calculating...';
    
    const now = new Date();
    const timeDiff = new Date(estimatedDate) - now;
    
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

  if (!parcelId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">No parcel ID provided for tracking</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Live Tracking Header */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isTracking ? 'Live Tracking Active' : 'Tracking Inactive'}
            </span>
          </div>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleManualRefresh}
            disabled={!isTracking}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !isTracking
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            🔄 Refresh
          </button>
          
          <button
            onClick={toggleAutoRefresh}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>

          <button
            onClick={startDemo}
            className="px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            🎬 Demo
          </button>
        </div>
      </div>

      {/* Current Status */}
      {trackingData && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getStatusIcon(trackingData.status)}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {trackingData.status.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600">
                  {trackingData.current_location || 'Location not specified'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-${getStatusColor(trackingData.status)}-500`}>
              {trackingData.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Estimated Arrival */}
          {trackingData.estimated_delivery && trackingData.status !== 'delivered' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-800">
                    Estimated Arrival
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-900">
                  {formatTimeRemaining(trackingData.estimated_delivery)}
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Expected by {new Date(trackingData.estimated_delivery).toLocaleDateString()} at {new Date(trackingData.estimated_delivery).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Last Updated */}
          {trackingData.last_updated && (
            <div className="text-xs text-gray-500">
              Last updated: {new Date(trackingData.last_updated).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Updates</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentUpdates.map((update) => (
              <div key={update.id} className="flex items-center space-x-2 text-xs p-2 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-500">
                  {update.timestamp.toLocaleTimeString()}
                </span>
                <span className="text-gray-700">{update.message}</span>
                {update.location && (
                  <span className="text-gray-600">- {update.location}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Tracking Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking; 