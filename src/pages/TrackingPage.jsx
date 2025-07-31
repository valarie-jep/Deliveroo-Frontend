import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Navbar from "../components/Navbar";

// Static libraries array to prevent LoadScript reloading
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
      } else {
        setError("Parcel not found");
        setParcel(null);
      }
    }
  }, [location.state, parcels]);

  const handleTrack = (e) => {
    e.preventDefault();
    setError(null);
    setParcel(null);
    setMapError(null);

    const foundParcel = parcels.find(
      (p) => String(p.id) === String(trackingId)
    );
    if (!foundParcel) {
      setError("Parcel not found");
      return;
    }
    setParcel(foundParcel);
  };

  const getCoordinates = (location) => {
    if (!location) {
      console.warn("No location provided, using default center");
      return center;
    }
    
    if (location.includes(',') && /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location)) {
      const [lat, lng] = location
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        console.warn("Invalid coordinates:", location);
        return center;
      }
      return { lat, lng };
    }
    
    console.warn("Invalid coordinates:", location);
    return center;
  };

  const getMapLocation = (parcel) => {
    return parcel.current_location || parcel.pickup_location_text || null;
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
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
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
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
          >
            Track Parcel
          </button>
        </form>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {parcel && (
          <div className="space-y-4">
            <div className="text-gray-800">
              <p>
                <span className="font-semibold">Parcel ID:</span> {parcel.id}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {parcel.status}
              </p>
              <p>
                <span className="font-semibold">Pickup Location:</span>{" "}
                {parcel.pickup_location_text || "Not available"}
              </p>
              <p>
                <span className="font-semibold">Current Location:</span>{" "}
                {parcel.current_location || parcel.pickup_location_text || "Not available"}
              </p>
              <p>
                <span className="font-semibold">Destination:</span>{" "}
                {parcel.destination_location_text}
              </p>
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
                      Current location: {getMapLocation(parcel) || "Not available"}
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
                    center={getCoordinates(getMapLocation(parcel))}
                    zoom={12}
                    onLoad={handleMapLoad}
                    onError={handleMapError}
                  >
                    {getMapLocation(parcel) && (
                      <Marker position={getCoordinates(getMapLocation(parcel))} />
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
            
            <button
              onClick={() => navigate(`/parcels/${parcel.id}`)}
              className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              View Full Details
            </button>
            <button
              onClick={() => navigate(`/parcels`)}
              className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Back to parcels
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
