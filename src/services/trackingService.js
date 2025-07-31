import { store } from '../redux/store';
import { updateParcelStatus } from '../redux/parcelSlice';

class TrackingService {
  constructor() {
    this.trackingIntervals = new Map();
    this.demoIntervals = new Map();
    this.isTracking = new Map(); // Track if real tracking is active
    this.isDemoActive = new Map(); // Track if demo is active
  }

  // Start real-time tracking
  startTracking(parcelId, onUpdate, onError) {
    console.log('🚀 Starting real-time tracking for parcel', parcelId);
    
    // Don't start if demo is active
    if (this.isDemoActive.get(parcelId)) {
      console.log('⚠️ Demo is active, skipping real tracking start');
      return;
    }

    // Stop any existing tracking first
    this.stopTracking(parcelId);
    
    this.isTracking.set(parcelId, true);
    this.isDemoActive.set(parcelId, false);

    // Initial fetch
    this.fetchTrackingData(parcelId, onUpdate, onError);

    // Set up polling interval
    const interval = setInterval(() => {
      if (this.isTracking.get(parcelId) && !this.isDemoActive.get(parcelId)) {
        this.fetchTrackingData(parcelId, onUpdate, onError);
      }
    }, 30000); // Poll every 30 seconds

    this.trackingIntervals.set(parcelId, interval);
  }

  // Stop real-time tracking
  stopTracking(parcelId) {
    console.log('🛑 Stopping tracking for parcel', parcelId);
    
    this.isTracking.set(parcelId, false);
    
    const interval = this.trackingIntervals.get(parcelId);
    if (interval) {
      clearInterval(interval);
      this.trackingIntervals.delete(parcelId);
    }
  }

  // Stop demo mode
  stopDemo(parcelId) {
    console.log('🛑 Stopping demo for parcel', parcelId);
    
    this.isDemoActive.set(parcelId, false);
    
    const interval = this.demoIntervals.get(parcelId);
    if (interval) {
      clearInterval(interval);
      this.demoIntervals.delete(parcelId);
    }
  }

  // Fetch tracking data from API
  async fetchTrackingData(parcelId, onUpdate, onError) {
    console.log('📡 Fetching tracking data for parcel', parcelId);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/tracking/${parcelId}/live`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Tracking data received:', data);
      
      if (onUpdate) {
        onUpdate(data);
      }
    } catch (error) {
      console.error('❌ Error fetching tracking data:', error);
      if (onError) {
        onError(error);
      }
    }
  }

  // Manual refresh
  async refreshTracking(parcelId) {
    return new Promise((resolve, reject) => {
      this.fetchTrackingData(parcelId, resolve, reject);
    });
  }

  // Start demo mode
  startDemo(parcelId, onUpdate) {
    console.log('🎬 Starting demo mode for real-time tracking');
    
    // Stop any existing tracking and demo
    this.stopTracking(parcelId);
    this.stopDemo(parcelId);
    
    // Set demo as active
    this.isDemoActive.set(parcelId, true);
    this.isTracking.set(parcelId, false);

    const demoUpdates = [
      { status: 'pending', current_location: 'Warehouse - Sorting Center', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 10, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'pending', current_location: 'Loading Dock - Ready for Pickup', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 20, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'pending', current_location: 'Courier Assigned - En Route to Pickup', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 30, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'in_transit', current_location: 'Picked up from sender', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 40, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'in_transit', current_location: 'In transit - Nairobi Central', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 50, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'in_transit', current_location: 'In transit - Thika Road', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 60, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'in_transit', current_location: 'In transit - Juja Junction', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 70, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'in_transit', current_location: 'Thika Town Center', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 80, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'in_transit', current_location: 'Approaching destination', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 90, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'in_transit', current_location: 'Out for delivery', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 95, map_position: { lat: -1.0352887, lng: 37.077005 } },
      { status: 'delivered', current_location: 'Delivered to recipient', estimated_delivery: '2025-02-08T19:40:24Z', last_updated: new Date().toISOString(), progress: 100, map_position: { lat: -0.08193009999999999, lng: 34.7285916 } }
    ];

    let updateIndex = 0;
    const demoInterval = setInterval(() => {
      if (updateIndex < demoUpdates.length) {
        const update = demoUpdates[updateIndex];
        console.log(`🎬 Demo update ${updateIndex + 1}:`, update);
        
        // Update Redux store
        store.dispatch(updateParcelStatus({
          parcelId: parseInt(parcelId),
          status: update.status,
          current_location: update.current_location,
          estimated_delivery: update.estimated_delivery,
          last_updated: update.last_updated,
          progress: update.progress,
          map_position: update.map_position
        }));

        // Call update callback
        if (onUpdate) {
          onUpdate(update);
        }

        updateIndex++;
      } else {
        clearInterval(demoInterval);
        this.demoIntervals.delete(parcelId);
        this.isDemoActive.set(parcelId, false);
        console.log('✅ Demo completed!');
      }
    }, 5000); // Update every 5 seconds

    this.demoIntervals.set(parcelId, demoInterval);
  }

  // Stop all tracking for a parcel
  stopAllTracking(parcelId) {
    this.stopTracking(parcelId);
    this.stopDemo(parcelId);
  }

  // Check if tracking is active
  isTrackingActive(parcelId) {
    return this.isTracking.get(parcelId) || this.isDemoActive.get(parcelId);
  }

  // Check if demo is active
  isDemoActive(parcelId) {
    return this.isDemoActive.get(parcelId);
  }
}

const trackingService = new TrackingService();
export default trackingService; 