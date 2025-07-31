import { store } from '../redux/store';
import { updateParcelStatus } from '../redux/parcelSlice';

class TrackingService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
    this.activeTrackers = new Map();
    this.demoIntervals = new Map();
  }

  // Get JWT token from localStorage
  getAuthToken() {
    return localStorage.getItem('token') || '';
  }

  // Start real-time tracking for a parcel
  startTracking(parcelId, onUpdate, onError) {
    if (this.activeTrackers.has(parcelId)) {
      console.log(`Tracking already active for parcel ${parcelId}`);
      return;
    }

    console.log(`🚀 Starting real-time tracking for parcel ${parcelId}`);

    const tracker = {
      parcelId,
      isTracking: true,
      pollInterval: null,
      onUpdate,
      onError,
      lastUpdate: null
    };

    // Start polling immediately
    this.updateTrackingData(tracker);
    
    // Set up polling interval (30 seconds)
    tracker.pollInterval = setInterval(() => {
      this.updateTrackingData(tracker);
    }, 30000);

    this.activeTrackers.set(parcelId, tracker);
    return tracker;
  }

  // Stop tracking for a parcel
  stopTracking(parcelId) {
    const tracker = this.activeTrackers.get(parcelId);
    if (tracker) {
      console.log(`🛑 Stopping tracking for parcel ${parcelId}`);
      tracker.isTracking = false;
      if (tracker.pollInterval) {
        clearInterval(tracker.pollInterval);
      }
      this.activeTrackers.delete(parcelId);
    }
    
    // Also stop any demo for this parcel
    this.stopDemo(parcelId);
  }

  // Update tracking data for a specific tracker
  async updateTrackingData(tracker) {
    try {
      console.log(`📡 Fetching tracking data for parcel ${tracker.parcelId}`);
      
      const response = await fetch(`${this.baseURL}/tracking/${tracker.parcelId}/live`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      tracker.lastUpdate = new Date();
      
      console.log(`✅ Tracking data received:`, data);
      
      // Call the update callback
      if (tracker.onUpdate) {
        tracker.onUpdate(data.live_tracking || data);
      }

    } catch (error) {
      console.error(`❌ Error updating tracking for parcel ${tracker.parcelId}:`, error);
      
      // Call the error callback
      if (tracker.onError) {
        tracker.onError(error);
      }
    }
  }

  // Manual refresh for a specific parcel
  async refreshTracking(parcelId) {
    const tracker = this.activeTrackers.get(parcelId);
    if (tracker) {
      await this.updateTrackingData(tracker);
    }
  }

  // Get current tracking status
  getTrackingStatus(parcelId) {
    const tracker = this.activeTrackers.get(parcelId);
    return tracker ? {
      isTracking: tracker.isTracking,
      lastUpdate: tracker.lastUpdate
    } : null;
  }

  // Stop all active tracking
  stopAllTracking() {
    console.log('🛑 Stopping all active tracking');
    for (const [parcelId] of this.activeTrackers) {
      this.stopTracking(parcelId);
    }
  }

  // Update parcel status in backend
  async updateParcelStatusInBackend(parcelId, status, additionalData = {}) {
    try {
      console.log(`🔄 Updating parcel ${parcelId} status to ${status} in backend`);
      
      const response = await fetch(`${this.baseURL}/parcels/${parcelId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          current_location: additionalData.current_location,
          estimated_delivery: additionalData.estimated_delivery,
          last_updated: new Date().toISOString(),
          ...additionalData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const updatedParcel = await response.json();
      console.log(`✅ Parcel status updated in backend:`, updatedParcel);
      
      // Update Redux store
      store.dispatch(updateParcelStatus({
        parcelId: parseInt(parcelId),
        status,
        current_location: additionalData.current_location,
        estimated_delivery: additionalData.estimated_delivery,
        last_updated: new Date().toISOString(),
        ...additionalData
      }));

      return updatedParcel;
    } catch (error) {
      console.error(`❌ Error updating parcel status in backend:`, error);
      throw error;
    }
  }

  // Enhanced demo mode that updates real data
  startDemo(parcelId, onUpdate) {
    console.log('🎬 Starting enhanced demo mode with real data updates');
    
    // Stop any existing tracking and demo for this parcel
    this.stopTracking(parcelId);
    this.stopDemo(parcelId);
    
    const demoUpdates = [
      { 
        status: 'pending', 
        current_location: 'Warehouse - Sorting Center',
        estimated_delivery: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 0,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'pending', 
        current_location: 'Loading Dock - Ready for Pickup',
        estimated_delivery: new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 5,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'pending', 
        current_location: 'Courier Assigned - En Route to Pickup',
        estimated_delivery: new Date(Date.now() + 46 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 10,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'in_transit', 
        current_location: 'Picked up from sender',
        estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 25,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Nairobi Central',
        estimated_delivery: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 35,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Thika Road',
        estimated_delivery: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 45,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Juja Junction',
        estimated_delivery: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 55,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Thika Town Center',
        estimated_delivery: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 65,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'in_transit', 
        current_location: 'Approaching destination',
        estimated_delivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 75,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'in_transit', 
        current_location: 'Out for delivery',
        estimated_delivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        progress: 85,
        map_position: { lat: -1.286389, lng: 36.817223 }
      },
      { 
        status: 'delivered', 
        current_location: 'Delivered to recipient',
        estimated_delivery: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        progress: 100,
        map_position: { lat: -1.286389, lng: 36.817223 }
      }
    ];

    let updateIndex = 0;
    const demoInterval = setInterval(async () => {
      if (updateIndex < demoUpdates.length) {
        const update = demoUpdates[updateIndex];
        console.log(`🎬 Demo update ${updateIndex + 1}:`, update);
        
        // Add some randomness to make it more realistic
        const randomOffset = (Math.random() - 0.5) * 0.001;
        update.map_position = {
          lat: update.map_position.lat + randomOffset,
          lng: update.map_position.lng + randomOffset
        };
        
        try {
          // Try to update the real parcel data in backend and Redux store
          await this.updateParcelStatusInBackend(parcelId, update.status, {
            current_location: update.current_location,
            estimated_delivery: update.estimated_delivery,
            progress: update.progress,
            map_position: update.map_position
          });
          
          console.log(`✅ Successfully updated parcel ${parcelId} status to ${update.status}`);
        } catch (error) {
          console.error('❌ Error updating parcel status in backend:', error);
          console.log('🔄 Falling back to frontend-only demo mode');
          
          // Fallback: Update only Redux store (frontend-only demo)
          store.dispatch(updateParcelStatus({
            parcelId: parseInt(parcelId),
            status: update.status,
            current_location: update.current_location,
            estimated_delivery: update.estimated_delivery,
            last_updated: new Date().toISOString(),
            progress: update.progress,
            map_position: update.map_position
          }));
        }
        
        // Call the update callback with the new data
        if (onUpdate) {
          onUpdate({
            ...update,
            parcelId,
            isDemoMode: true
          });
        }
        
        updateIndex++;
      } else {
        clearInterval(demoInterval);
        this.demoIntervals.delete(parcelId);
        console.log('✅ Demo completed! Parcel status has been updated throughout the system.');
      }
    }, 5000); // Update every 5 seconds for demo

    this.demoIntervals.set(parcelId, demoInterval);
    return demoInterval;
  }

  // Stop demo for a specific parcel
  stopDemo(parcelId) {
    const demoInterval = this.demoIntervals.get(parcelId);
    if (demoInterval) {
      clearInterval(demoInterval);
      this.demoIntervals.delete(parcelId);
      console.log(`🛑 Stopped demo for parcel ${parcelId}`);
    }
  }

  // Stop all demos
  stopAllDemos() {
    console.log('🛑 Stopping all demos');
    for (const [parcelId, interval] of this.demoIntervals) {
      clearInterval(interval);
    }
    this.demoIntervals.clear();
  }
}

const trackingService = new TrackingService();
export default trackingService; 