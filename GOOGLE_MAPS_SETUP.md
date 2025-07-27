# Google Maps API Setup Guide

## Issues Fixed

The tracking page had several issues that have been resolved:

1. **Missing Google Maps API Key** - The app was trying to use an undefined API key
2. **Invalid Coordinate Parsing** - The app was trying to parse text locations as coordinates
3. **Multiple LoadScript Components** - This was causing "google api is already presented" errors
4. **Poor Error Handling** - No user-friendly error messages

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (for displaying maps)
   - **Places API** (for location autocomplete)
   - **Geocoding API** (for address-to-coordinate conversion)
4. Go to "Credentials" and create an API key
5. Restrict the API key to your domain for security

### 2. Configure the API Key

1. Open the `.env` file in your project root
2. Replace `your_google_maps_api_key_here` with your actual API key:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyYourActualApiKeyHere
```

### 3. Restart the Development Server

After adding the API key, restart your development server:

```bash
npm start
```

## Features Added

- **Graceful API Key Handling**: Shows a helpful message when API key is missing
- **Better Coordinate Validation**: Properly handles text locations vs coordinate strings
- **Error Messages**: User-friendly error messages for map loading issues
- **Fallback Center**: Uses Nairobi coordinates as default when location is invalid
- **Location Autocomplete**: Dropdown with Google Places suggestions for pickup/destination

## Current Behavior

- If no API key is configured: Shows a placeholder with setup instructions
- If location is text (like "Rebeccachester"): Uses default center coordinates
- If location is valid coordinates: Shows the actual location on the map
- If map fails to load: Shows an error message with troubleshooting tips
- Location inputs now have autocomplete dropdowns with Google Places suggestions

## Troubleshooting

1. **"Google Maps API key not configured"**: Add your API key to the `.env` file
2. **"Invalid coordinates"**: The backend is sending text locations instead of coordinates
3. **"Failed to load map"**: Check your internet connection and API key restrictions
4. **"google api is already presented"**: This error should no longer occur with the fixed implementation
5. **Autocomplete not working**: Make sure Places API is enabled in Google Cloud Console 