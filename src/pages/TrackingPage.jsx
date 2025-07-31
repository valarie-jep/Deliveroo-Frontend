import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import Navbar from "../components/Navbar";
import RealTimeTracking from "../components/RealTimeTracking";
import RouteProgress from "../components/RouteProgress";
import JourneyMetrics from "../components/JourneyMetrics";

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
      } else {
        setError("Parcel not found");
        setParcel(null);
        setShowTracking(false);
      }
    }
  }, [location.state, parcels]);

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
  };

  const getPickupCoordinates = (parcel) => {
    if (!parcel || !parcel.pick_up_latitude || !parcel.pick_up_longitude) {
      return null;
    }
    return { 
      lat: parseFloat(parcel.pick_up_latitude), 
      lng: parseFloat(parcel.pick_up_longitude) 
    };
  };

  const getDestinationCoordinates = (parcel) => {
    if (!parcel || !parcel.destination_latitude || !parcel.destination_longitude) {
      return null;
    }
    return { 
      lat: parseFloat(parcel.destination_latitude), 
      lng: parseFloat(parcel.destination_longitude) 
    };
  };

  const getCurrentPosition = (parcel) => {
    const pickup = getPickupCoordinates(parcel);
    const destination = getDestinationCoordinates(parcel);
    
    if (!pickup || !destination) {
      return pickup || destination || center;
    }

    const status = parcel.status;
    let progress = 0;

    switch (status) {
      case 'pending':
        progress = 0;
        break;
      case 'in_transit':
        progress = 0.5;
        break;
      case 'delivered':
        progress = 1;
        break;
      default:
        progress = 0.25;
    }

    return {
      lat: pickup.lat + (destination.lat - pickup.lat) * progress,
      lng: pickup.lng + (destination.lng - pickup.lng) * progress
    };
  };

  const getMapCenter = (parcel) => {
    const pickup = getPickupCoordinates(parcel);
    const destination = getDestinationCoordinates(parcel);
    
    if (pickup && destination) {
      return {
        lat: (pickup.lat + destination.lat) / 2,
        lng: (pickup.lng + destination.lng) / 2
      };
    }
    
    return pickup || destination || center;
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tracking Information */}
            <div>
              <JourneyMetrics parcel={parcel} />
              <RouteProgress parcel={parcel} />
              <RealTimeTracking parcelId={parcel.id} />
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Location Map
              </h3>
              
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
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={getMapCenter(parcel)}
                      zoom={10}
                      onLoad={handleMapLoad}
                      onError={handleMapError}
                    >
                      {/* Pickup Marker */}
                      {getPickupCoordinates(parcel) && (
                        <Marker 
                          position={getPickupCoordinates(parcel)}
                          icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32)
                          }}
                          label={{
                            text: 'Pickup',
                            className: 'marker-label'
                          }}
                        />
                      )}

                      {/* Destination Marker */}
                      {getDestinationCoordinates(parcel) && (
                        <Marker 
                          position={getDestinationCoordinates(parcel)}
                          icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32)
                          }}
                          label={{
                            text: 'Destination',
                            className: 'marker-label'
                          }}
                        />
                      )}

                      {/* Current Position Marker */}
                      <Marker 
                        position={getCurrentPosition(parcel)}
                        icon={{
                          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                          scaledSize: new window.google.maps.Size(40, 40)
                        }}
                        label={{
                          text: 'Parcel',
                          className: 'marker-label'
                        }}
                      />

                      {/* Route Line */}
                      {getPickupCoordinates(parcel) && getDestinationCoordinates(parcel) && (
                        <Polyline
                          path={[getPickupCoordinates(parcel), getDestinationCoordinates(parcel)]}
                          options={{
                            strokeColor: '#FF6B35',
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                            geodesic: true
                          }}
                        />
                      )}
                    </GoogleMap>
                  </LoadScript>
                )}
                {mapError && (
                  <div className="p-4 bg-red-50 border-t border-red-200">
                    <p className="text-red-600 text-sm">{mapError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showTracking && parcel && (
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
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
