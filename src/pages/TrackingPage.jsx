import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Navbar from "../components/Navbar";

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
  const navigate = useNavigate();
  const location = useLocation();
  const parcels = useSelector((state) => state.parcels.list);

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
    const [lat, lng] = location
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Invalid coordinates:", location);
      return center;
    }
    return { lat, lng };
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
                <span className="font-semibold">Current Location:</span>{" "}
                {parcel.current_location || "Not available"}
              </p>
              <p>
                <span className="font-semibold">Destination:</span>{" "}
                {parcel.destination_location_text}
              </p>
            </div>
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              onError={(e) => console.error("LoadScript error:", e)}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={getCoordinates(parcel.current_location)}
                zoom={12}
                onLoad={() => console.log("Map loaded successfully")}
                onError={(e) => console.error("Map error:", e)}
              >
                {parcel.current_location && (
                  <Marker position={getCoordinates(parcel.current_location)} />
                )}
              </GoogleMap>
            </LoadScript>
            <button
              onClick={() => navigate(`/parcels/${parcel.id}`)}
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              View Full Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
