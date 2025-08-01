import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import TrackingMap from '../components/TrackingMap';
import RealTimeTracking from '../components/RealTimeTracking';
import RouteProgress from '../components/RouteProgress';
import JourneyMetrics from '../components/JourneyMetrics';
import LiveTracking from '../components/LiveTracking';
import Navbar from '../components/Navbar';
import { calculateMidpoint } from '../utils/distanceCalculator';
import { fetchParcels } from '../redux/parcelSlice';

// Tab component
const Tab = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
);

// SVG Icons
const PackageIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const TrackingPage = () => {
  const { parcelId } = useParams();
  const dispatch = useDispatch();
  
  const parcels = useSelector(state => state.parcels.parcels);
  
  const parcel = useSelector(state => 
    state.parcels.parcels.find(p => p.id === parseInt(parcelId))
  );
  
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(12);
  const [currentParcel, setCurrentParcel] = useState(parcel);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('tracking');
  const [globalDemoState, setGlobalDemoState] = useState(false);

  // Fetch parcel if not found in store
  useEffect(() => {
    if (!parcel && parcelId) {
      dispatch(fetchParcels());
    }
  }, [parcel, parcelId, dispatch]);

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
    
    console.log('📦 Updated parcel data:', updatedParcel);
    setCurrentParcel(updatedParcel);
    setIsDemoMode(trackingData.isDemoMode || false);

    // Update map view if we have new coordinates
    if (trackingData.map_position) {
      setMapCenter(trackingData.map_position);
      setMapZoom(14); // Zoom in for current position
    }

    // Update global demo state
    if (trackingData.isDemoMode) {
      setGlobalDemoState(true);
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
          <div className="text-6xl mb-4 text-gray-400">
            <PackageIcon />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parcel Not Found</h2>
          <p className="text-gray-600">The parcel you're looking for doesn't exist.</p>
          <div className="mt-4">
            <button 
              onClick={() => dispatch(fetchParcels())}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Parcels
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Parcel ID: {parcelId}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">
                  <PackageIcon />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Parcel #{parcel.id} Tracking
                  </h1>
                  <p className="text-base text-gray-600 mt-1">
                    {parcel.pickup_location_text} → {parcel.destination_location_text}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                parcel.status === 'delivered' ? 'bg-green-500' :
                parcel.status === 'in_transit' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}>
                {parcel.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/parcels" 
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Parcels
              </Link>
              
              {/* Global Demo Mode Indicator */}
              {globalDemoState && (
                <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">🎬 Demo Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <Tab 
              active={activeTab === 'tracking'} 
              onClick={() => setActiveTab('tracking')}
            >
              📍 Live Tracking
            </Tab>
            <Tab 
              active={activeTab === 'map'} 
              onClick={() => setActiveTab('map')}
            >
              🗺️ Location Map
            </Tab>
            <Tab 
              active={activeTab === 'progress'} 
              onClick={() => setActiveTab('progress')}
            >
              📊 Journey Progress
            </Tab>
            <Tab 
              active={activeTab === 'metrics'} 
              onClick={() => setActiveTab('metrics')}
            >
              📈 Journey Metrics
            </Tab>
            <Tab 
              active={activeTab === 'updates'} 
              onClick={() => setActiveTab('updates')}
            >
              🔄 Real-time Updates
            </Tab>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {/* Live Tracking Tab */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <LiveTracking 
                parcelId={parcelId} 
                parcel={currentParcel}
                onTrackingUpdate={handleTrackingUpdate}
                globalDemoState={globalDemoState}
                setGlobalDemoState={setGlobalDemoState}
              />
            </div>
          )}

          {/* Location Map Tab */}
          {activeTab === 'map' && (
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-900">Location Map</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Real-time location tracking and route visualization
                </p>
              </div>
              <div className="h-[600px]">
                <TrackingMap 
                  parcel={currentParcel}
                  center={mapCenter}
                  zoom={mapZoom}
                  isDemoMode={isDemoMode}
                />
              </div>
            </div>
          )}

          {/* Journey Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <RouteProgress parcel={currentParcel} isDemoMode={isDemoMode} />
            </div>
          )}

          {/* Journey Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <JourneyMetrics parcel={currentParcel} isDemoMode={isDemoMode} />
            </div>
          )}

          {/* Real-time Updates Tab */}
          {activeTab === 'updates' && (
            <div className="bg-white rounded-xl shadow-lg border">
              <div className="p-6 border-b bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-900">Real-time Updates</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Latest tracking information and status updates
                </p>
              </div>
              <div className="p-6">
                <RealTimeTracking parcelId={parcelId} isDemoMode={isDemoMode} />
              </div>
            </div>
          )}
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
