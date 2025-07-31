import React, { useState, useEffect, useCallback } from 'react';
import trackingService from '../services/trackingService';
import { toast } from 'react-toastify';

// SVG Icons
const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const StopIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

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

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const LiveTracking = ({ parcelId, parcel, onTrackingUpdate }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

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
      message: `Status updated to ${data.status.replace('_', ' ').toUpperCase()}`,
      progress: data.progress || 0
    };

    setRecentUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates

    // Show toast notification for status changes
    if (data.status !== parcel?.status) {
      toast.info(`Parcel ${parcelId} status: ${data.status.replace('_', ' ').toUpperCase()}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    // Call parent callback with enhanced data
    if (onTrackingUpdate) {
      onTrackingUpdate({
        ...data,
        parcelId,
        isDemoMode
      });
    }
  }, [parcelId, parcel?.status, onTrackingUpdate, isDemoMode]);

  // Handle tracking errors
  const handleTrackingError = useCallback((error) => {
    console.error('❌ Live tracking error:', error);
    setError(error.message);
    toast.error('Failed to update tracking data', {
      position: "top-right",
      autoClose: 3000,
    });
  }, []);

  // Initialize tracking on mount
  useEffect(() => {
    if (parcelId && autoRefresh && !isDemoMode) {
      startTracking();
    }

    // Cleanup on unmount
    return () => {
      if (parcelId) {
        trackingService.stopAllTracking(parcelId);
      }
    };
  }, [parcelId, autoRefresh, startTracking, isDemoMode]);

  // Update tracking data when parcel changes
  useEffect(() => {
    if (parcel) {
      setTrackingData({
        status: parcel.status,
        current_location: parcel.pickup_location_text || 'Location not specified',
        estimated_delivery: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 0
      });
    }
  }, [parcel]);

  // Start tracking
  const startTracking = useCallback(() => {
    if (!parcelId) return;

    console.log('🚀 Starting live tracking for parcel:', parcelId);
    setIsTracking(true);
    setError(null);
    setIsDemoMode(false);

    trackingService.startTracking(parcelId, handleTrackingUpdate, handleTrackingError);
  }, [parcelId, handleTrackingUpdate, handleTrackingError]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (!parcelId) return;

    console.log('🛑 Stopping live tracking for parcel:', parcelId);
    setIsTracking(false);
    setIsDemoMode(false);
    trackingService.stopAllTracking(parcelId);
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
    setIsDemoMode(true);
    setError(null);
    
    // Stop any existing tracking first
    trackingService.stopAllTracking(parcelId);
    
    // Start demo
    trackingService.startDemo(parcelId, handleTrackingUpdate);
    
    toast.info('Demo mode started! Real parcel data is being updated throughout the system.', {
      position: "top-right",
      autoClose: 4000,
    });
  }, [parcelId, handleTrackingUpdate]);

  // Stop demo mode
  const stopDemo = useCallback(() => {
    console.log('🛑 Stopping demo mode');
    setIsDemoMode(false);
    trackingService.stopDemo(parcelId);
    
    // Restart real tracking if auto-refresh is enabled
    if (autoRefresh) {
      setTimeout(() => {
        startTracking();
      }, 100);
    }
    
    toast.info('Demo mode stopped. Parcel status changes are now permanent in the system.', {
      position: "top-right",
      autoClose: 3000,
    });
  }, [parcelId, autoRefresh, startTracking]);

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
              {isDemoMode ? 'Demo Mode Active' : isTracking ? 'Live Tracking Active' : 'Tracking Inactive'}
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
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center space-x-1 ${
              !isTracking
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <RefreshIcon />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={toggleAutoRefresh}
            disabled={isDemoMode}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isDemoMode
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : autoRefresh
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isDemoMode ? 'Demo Active' : autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>

          {isDemoMode ? (
            <button
              onClick={stopDemo}
              className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center space-x-1"
            >
              <StopIcon />
              <span>Stop Demo</span>
            </button>
          ) : (
            <button
              onClick={startDemo}
              className="px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center space-x-1"
            >
              <PlayIcon />
              <span>Start Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-800">
              Demo Mode Active
            </span>
          </div>
          <p className="text-xs text-purple-600 mt-1">
            Watch the map, progress bars, and status indicators update in real-time!
          </p>
        </div>
      )}

      {/* Current Status */}
      {trackingData && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl text-gray-600">
                {getStatusIcon(trackingData.status)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {trackingData.status.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600">
                  {trackingData.current_location || 'Location not specified'}
                </p>
                {trackingData.progress !== undefined && (
                  <p className="text-xs text-blue-600 mt-1">
                    Progress: {trackingData.progress}%
                  </p>
                )}
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
                {update.progress !== undefined && (
                  <span className="text-blue-600">({update.progress}%)</span>
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