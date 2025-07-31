import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Navbar from "../components/Navbar";
import RealTimeTracking from "../components/RealTimeTracking";
import LiveTracking from "../components/LiveTracking";
import RouteProgress from "../components/RouteProgress";
import JourneyMetrics from "../components/JourneyMetrics";
import TrackingMap from "../components/TrackingMap";
import { calculateMidpoint, calculateCurrentPosition } from "../utils/distanceCalculator";

const GOOGLE_MAPS_LIBRARIES = ["places"];

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -1.286389,
  lng: 36.817223,
};

const TrackingPage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(10);
  const [activeTab, setActiveTab] = useState('live');
  const navigate = useNavigate();
  const location = useLocation();
  const parcels = useSelector((state) => state.parcels.list);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey = googleMapsApiKey && googleMapsApiKey !== 'your_google_maps_api_key_here';

  useEffect(() => {
    if (location.state?.trackingId) {
      setTrackingId(location.state.trackingId);
      const foundParcel = parcels.find(
        (p) => String(p.id) === String(location.state.trackingId)
      );
      if (foundParcel) {
        setParcel(foundParcel);
        setError(null);
        setShowTracking(true);
        updateMapView(foundParcel);
      } else {
        setError("Parcel not found");
        setParcel(null);
        setShowTracking(false);
      }
    }
  }, [location.state, parcels]);

  const getPickupCoordinates = useCallback((parcel) => {
    if (!parcel || !parcel.pick_up_latitude || !parcel.pick_up_longitude) {
      return null;
    }
    return { 
      lat: parseFloat(parcel.pick_up_latitude), 
      lng: parseFloat(parcel.pick_up_longitude) 
    };
  }, []);

  const getDestinationCoordinates = useCallback((parcel) => {
    if (!parcel || !parcel.destination_latitude || !parcel.destination_longitude) {
      return null;
    }
    return { 
      lat: parseFloat(parcel.destination_latitude), 
      lng: parseFloat(parcel.destination_longitude) 
    };
  }, []);

  const updateMapView = useCallback((parcel) => {
    const pickup = getPickupCoordinates(parcel);
    const destination = getDestinationCoordinates(parcel);
    
    if (pickup && destination) {
      // Calculate midpoint for better centering
      const midpoint = calculateMidpoint(
        pickup.lat, pickup.lng,
        destination.lat, destination.lng
      );
      setMapCenter(midpoint);
      
      // Calculate distance to determine appropriate zoom level
      const distance = Math.sqrt(
        Math.pow(destination.lat - pickup.lat, 2) + 
        Math.pow(destination.lng - pickup.lng, 2)
      );
      
      // Adjust zoom based on distance
      if (distance > 0.1) {
        setMapZoom(8); // Zoom out for longer distances
      } else if (distance > 0.01) {
        setMapZoom(10); // Medium zoom
      } else {
        setMapZoom(12); // Zoom in for short distances
      }
    } else if (pickup) {
      setMapCenter(pickup);
      setMapZoom(12);
    } else if (destination) {
      setMapCenter(destination);
      setMapZoom(12);
    }
  }, [getPickupCoordinates, getDestinationCoordinates]);

  const handleTrack = (e) => {
    e.preventDefault();
    setError(null);
    setParcel(null);
    setMapError(null);
    setShowTracking(false);

    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }

    const foundParcel = parcels.find(
      (p) => String(p.id) === String(trackingId)
    );
    if (!foundParcel) {
      setError("Parcel not found");
      return;
    }
    setParcel(foundParcel);
    setShowTracking(true);
    updateMapView(foundParcel);
  };

  const handleMapLoad = () => {
    console.log("Map loaded successfully");
    setMapError(null);
  };

  const handleMapError = (error) => {
    console.error("Map error:", error);
    setMapError("Failed to load map. Please check your internet connection.");
  };

  const handleScriptLoadError = (error) => {
    console.error("LoadScript error:", error);
    setMapError("Failed to load Google Maps. Please check your API key configuration.");
  };

  const handleRefreshTracking = () => {
    if (parcel) {
      updateMapView(parcel);
    }
  };

  const handleTrackingUpdate = useCallback((trackingData) => {
    console.log('📡 Tracking update received:', trackingData);
    
    // Update parcel with new tracking data
    if (parcel && trackingData) {
      const updatedParcel = {
        ...parcel,
        status: trackingData.status,
        current_location: trackingData.current_location
      };
      setParcel(updatedParcel);
    }
  }, [parcel]);

  const tabs = [
    { id: 'live', label: 'Live Tracking', icon: '🚚' },
    { id: 'details', label: 'Journey Details', icon: '📊' },
    { id: 'map', label: 'Location Map', icon: '🗺️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-8 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-orange-600">
            Track Your Parcel
          </h2>
          <form
            onSubmit={handleTrack}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Parcel ID"
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="submit"
              className="bg-orange-500 text-white font-semibold py-2 px-6 rounded hover:bg-orange-600 transition"
            >
              Track Parcel
            </button>
          </form>
          {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        </div>

        {showTracking && parcel && (
          <>
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-lg mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'live' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Live Tracking */}
                    <div>
                      <LiveTracking 
                        parcelId={parcel.id} 
                        parcel={parcel}
                        onTrackingUpdate={handleTrackingUpdate}
                      />
                    </div>

                    {/* Journey Metrics */}
                    <div>
                      <JourneyMetrics parcel={parcel} />
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <JourneyMetrics parcel={parcel} />
                    <RouteProgress parcel={parcel} />
                    <RealTimeTracking parcelId={parcel.id} />
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Map */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Location Map
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Zoom: {mapZoom}
                          </span>
                          <button
                            onClick={handleRefreshTracking}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Reset View
                          </button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        {!hasValidApiKey ? (
                          <div className="h-96 flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                              <p className="text-gray-600 mb-2">Google Maps API key not configured</p>
                              <p className="text-sm text-gray-500">
                                Please add your Google Maps API key to the .env file
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Location: {parcel.pickup_location_text || "Not available"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <LoadScript
                            googleMapsApiKey={googleMapsApiKey}
                            libraries={GOOGLE_MAPS_LIBRARIES}
                            onError={handleScriptLoadError}
                          >
                            <TrackingMap
                              parcel={parcel}
                              containerStyle={containerStyle}
                              center={mapCenter}
                              zoom={mapZoom}
                              onLoad={handleMapLoad}
                              onError={handleMapError}
                            />
                          </LoadScript>
                        )}
                        {mapError && (
                          <div className="p-4 bg-red-50 border-t border-red-200">
                            <p className="text-red-600 text-sm">{mapError}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Map Legend */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Map Legend</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">Pickup Location</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600">Destination</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">Current Position</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-1 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-600">Route Path</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Journey Details */}
                    <div className="space-y-4">
                      <JourneyMetrics parcel={parcel} />
                      <RouteProgress parcel={parcel} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/parcels/${parcel.id}`)}
                className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                View Full Details
              </button>
              <button
                onClick={() => navigate(`/parcels`)}
                className="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Back to Parcels
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
