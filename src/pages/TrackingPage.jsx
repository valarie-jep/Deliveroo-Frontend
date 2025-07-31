import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TrackingMap from '../components/TrackingMap';
import RealTimeTracking from '../components/RealTimeTracking';
import RouteProgress from '../components/RouteProgress';
import JourneyMetrics from '../components/JourneyMetrics';
import LiveTracking from '../components/LiveTracking';
import { calculateMidpoint, calculateProgressPercentage, calculateEstimatedArrival } from '../utils/distanceCalculator';

const TrackingPage = () => {
  const { parcelId } = useParams();
  const parcel = useSelector(state => 
    state.parcels.parcels.find(p => p.id === parseInt(parcelId))
  );

  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(12);
  const [currentParcel, setCurrentParcel] = useState(parcel);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Update map view based on parcel coordinates
  const updateMapView = useCallback((parcelData) => {
    if (!parcelData) return;

    const pickupCoords = parcelData.pickup_location_coordinates;
    const destinationCoords = parcelData.destination_location_coordinates;

    if (pickupCoords && destinationCoords) {
      try {
        const pickup = JSON.parse(pickupCoords);
        const destination = JSON.parse(destinationCoords);
        
        // Calculate midpoint for map center
        const midpoint = calculateMidpoint(pickup, destination);
        setMapCenter(midpoint);
        
        // Calculate dynamic zoom based on distance
        const distance = Math.sqrt(
          Math.pow(pickup.lat - destination.lat, 2) + 
          Math.pow(pickup.lng - destination.lng, 2)
        );
        
        // Adjust zoom based on distance
        if (distance > 0.1) {
          setMapZoom(10); // Far distance
        } else if (distance > 0.05) {
          setMapZoom(12); // Medium distance
        } else {
          setMapZoom(14); // Close distance
        }
      } catch (error) {
        console.error('Error parsing coordinates:', error);
        // Fallback to default coordinates
        setMapCenter({ lat: -1.286389, lng: 36.817223 });
        setMapZoom(12);
      }
    } else {
      // Fallback to default coordinates
      setMapCenter({ lat: -1.286389, lng: 36.817223 });
      setMapZoom(12);
    }
  }, []);

  // Handle tracking updates from LiveTracking component
  const handleTrackingUpdate = useCallback((trackingData) => {
    console.log('🔄 Tracking update received:', trackingData);
    
    // Update current parcel with new tracking data
    const updatedParcel = {
      ...currentParcel,
      status: trackingData.status,
      current_location: trackingData.current_location,
      estimated_delivery: trackingData.estimated_delivery,
      last_updated: trackingData.last_updated,
      progress: trackingData.progress
    };
    
    setCurrentParcel(updatedParcel);
    setIsDemoMode(trackingData.isDemoMode || false);

    // Update map view if we have new coordinates
    if (trackingData.map_position) {
      console.log('🗺️ Updating map position:', trackingData.map_position);
      setMapCenter(trackingData.map_position);
      setMapZoom(14); // Zoom in for current position
    }

    // Show demo mode notification
    if (trackingData.isDemoMode) {
      console.log('🎬 Demo mode active - updating all components');
    }
  }, [currentParcel]);

  // Initialize map view on mount
  useEffect(() => {
    if (parcel) {
      setCurrentParcel(parcel);
      updateMapView(parcel);
    }
  }, [parcel, updateMapView]);

  if (!parcel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parcel Not Found</h2>
          <p className="text-gray-600">The parcel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">📦</div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Parcel #{parcel.id} Tracking
                </h1>
                <p className="text-sm text-gray-600">
                  {parcel.pickup_location_text} → {parcel.destination_location_text}
                </p>
              </div>
            </div>
            
            {/* Demo Mode Indicator */}
            {isDemoMode && (
              <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button className="text-blue-600 border-b-2 border-blue-600 py-2 px-1 text-sm font-medium">
              Live Tracking
            </button>
            <button className="text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium">
              Journey Details
            </button>
            <button className="text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium">
              Location Map
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Live Tracking */}
          <div className="lg:col-span-1 space-y-6">
            <LiveTracking 
              parcelId={parcelId} 
              parcel={currentParcel}
              onTrackingUpdate={handleTrackingUpdate}
            />
          </div>

          {/* Right Column - Map and Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Location Map</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time location tracking and route visualization
                </p>
              </div>
              <div className="h-96">
                <TrackingMap 
                  parcel={currentParcel}
                  center={mapCenter}
                  zoom={mapZoom}
                  isDemoMode={isDemoMode}
                />
              </div>
            </div>

            {/* Progress and Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RouteProgress parcel={currentParcel} isDemoMode={isDemoMode} />
              <JourneyMetrics parcel={currentParcel} isDemoMode={isDemoMode} />
            </div>

            {/* Real-time Updates */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Real-time Updates</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Latest tracking information and status updates
                </p>
              </div>
              <div className="p-4">
                <RealTimeTracking parcel={currentParcel} isDemoMode={isDemoMode} />
              </div>
            </div>
          </div>
        </div>

        {/* Demo Mode Instructions */}
        {isDemoMode && (
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-800">Demo Mode Active</span>
            </div>
            <p className="text-sm text-purple-700">
              <strong>Real data is being updated!</strong> The parcel status is being modified in the database and will persist everywhere - 
              tracking page, parcels list, admin panel, etc. This simulates a complete delivery journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
