import { store } from '../redux/store';
import { updateParcelStatus } from '../redux/parcelSlice';
import { BASE_URL } from '../config/api';

class TrackingService {
  constructor() {
    this.trackingIntervals = new Map();
    this.demoIntervals = new Map();
    this.isTracking = new Map(); // Track if real tracking is active
    this.isDemoActive = new Map(); // Track if demo is active
    this.errorCounts = new Map(); // Track error counts for backoff
    this.presentationMode = false; // Flag for presentation mode
    this.cleanupCallbacks = new Map(); // Track cleanup callbacks
  }

  // Enable presentation mode (bypasses some rate limiting)
  enablePresentationMode() {
    this.presentationMode = true;
    console.log('🎬 Presentation mode enabled - faster updates for demo');
  }

  // Disable presentation mode
  disablePresentationMode() {
    this.presentationMode = false;
    console.log('📊 Presentation mode disabled - normal rate limiting');
  }

  // Start real-time tracking
  startTracking(parcelId, onUpdate, onError) {
    console.log(`🚀 Starting live tracking for parcel: ${parcelId}`);
    
    // Don't start if demo is active
    if (this.isDemoActive.get(parcelId)) {
      console.log('⚠️ Demo is active, skipping real tracking start');
      return;
    }

    // Stop any existing tracking first
    this.stopTracking(parcelId);
    
    this.isTracking.set(parcelId, true);
    this.isDemoActive.set(parcelId, false);
    this.errorCounts.set(parcelId, 0);

    // Initial fetch
    this.fetchTrackingData(parcelId, onUpdate, onError);

    // Set up polling interval with longer interval to prevent rate limiting
    const interval = setInterval(() => {
      if (this.isTracking.get(parcelId) && !this.isDemoActive.get(parcelId)) {
        this.fetchTrackingData(parcelId, onUpdate, onError);
      }
    }, 30000); // Poll every 30 seconds for faster real-time updates

    this.trackingIntervals.set(parcelId, interval);
    
    // Store cleanup callback
    this.cleanupCallbacks.set(parcelId, () => {
      if (interval) {
        clearInterval(interval);
      }
    });
  }

  // Stop real-time tracking
  stopTracking(parcelId) {
    console.log(`🛑 Stopping tracking for parcel ${parcelId}`);
    
    this.isTracking.set(parcelId, false);
    this.isDemoActive.set(parcelId, false);

    // Clear tracking interval
    const interval = this.trackingIntervals.get(parcelId);
    if (interval) {
      clearInterval(interval);
      this.trackingIntervals.delete(parcelId);
    }

    // Clear demo interval
    const demoInterval = this.demoIntervals.get(parcelId);
    if (demoInterval) {
      clearInterval(demoInterval);
      this.demoIntervals.delete(parcelId);
    }

    // Execute cleanup callback
    const cleanup = this.cleanupCallbacks.get(parcelId);
    if (cleanup) {
      cleanup();
      this.cleanupCallbacks.delete(parcelId);
    }

    // Reset error count
    this.errorCounts.delete(parcelId);
  }

  // Stop demo mode
  stopDemo(parcelId) {
    console.log(`🛑 Stopping demo for parcel ${parcelId}`);
    
    this.isDemoActive.set(parcelId, false);

    // Clear demo interval
    const demoInterval = this.demoIntervals.get(parcelId);
    if (demoInterval) {
      clearInterval(demoInterval);
      this.demoIntervals.delete(parcelId);
    }

    // Restart real tracking if it was active before demo
    if (this.isTracking.get(parcelId)) {
      console.log(`🔄 Restarting real tracking for parcel ${parcelId}`);
      // Small delay to ensure clean state transition
      setTimeout(() => {
        if (this.isTracking.get(parcelId)) {
          this.fetchTrackingData(parcelId);
        }
      }, 1000);
    }
  }

  // Fetch tracking data from API with rate limiting
  async fetchTrackingData(parcelId, onUpdate, onError) {
    console.log(`📡 Fetching tracking data for parcel ${parcelId}`);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}/tracking/${parcelId}/live`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 429) {
        // Rate limited - implement exponential backoff
        const errorCount = this.errorCounts.get(parcelId) || 0;
        this.errorCounts.set(parcelId, errorCount + 1);
        
        // Less aggressive backoff in presentation mode
        const baseDelay = this.presentationMode ? 5000 : 30000; // 5s vs 30s
        const backoffDelay = Math.min(baseDelay * Math.pow(2, errorCount), this.presentationMode ? 60000 : 300000);
        console.log(`⚠️ Rate limited. Backing off for ${backoffDelay}ms (presentation mode: ${this.presentationMode})`);
        
        setTimeout(() => {
          if (this.isTracking.get(parcelId)) {
            this.fetchTrackingData(parcelId, onUpdate, onError);
          }
        }, backoffDelay);
        
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Tracking data received:', data);
      
      // Reset error count on success
      this.errorCounts.set(parcelId, 0);
      
      if (onUpdate) {
        onUpdate(data);
      }
    } catch (error) {
      console.error('❌ Error fetching tracking data:', error);
      
      // Handle rate limiting specifically
      if (error.message.includes('429')) {
        const errorCount = this.errorCounts.get(parcelId) || 0;
        this.errorCounts.set(parcelId, errorCount + 1);
        
        const backoffDelay = Math.min(30000 * Math.pow(2, errorCount), 300000);
        console.log(`⚠️ Rate limited. Backing off for ${backoffDelay}ms`);
        
        setTimeout(() => {
          if (this.isTracking.get(parcelId)) {
            this.fetchTrackingData(parcelId, onUpdate, onError);
          }
        }, backoffDelay);
        
        return;
      }
      
      if (onError) {
        onError(error);
      }
    }
  }

  // Manual refresh with rate limiting
  async refreshTracking(parcelId) {
    return new Promise((resolve, reject) => {
      // Add a small delay to prevent rapid successive calls
      setTimeout(() => {
        this.fetchTrackingData(parcelId, resolve, reject);
      }, 1000);
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

  // Stop all tracking for a parcel (both real and demo)
  stopAllTracking(parcelId) {
    this.stopTracking(parcelId);
    this.stopDemo(parcelId);
  }

  // Check if tracking is active
  isTrackingActive(parcelId) {
    return this.isTracking.get(parcelId) || false;
  }

  // Check if demo is active
  isDemoActive(parcelId) {
    return this.isDemoActive.get(parcelId) || false;
  }

  // Comprehensive cleanup for component unmount
  cleanup(parcelId) {
    console.log(`🧹 Cleaning up tracking for parcel ${parcelId}`);
    
    // Stop all tracking
    this.stopAllTracking(parcelId);
    
    // Clear all stored data
    this.isTracking.delete(parcelId);
    this.isDemoActive.delete(parcelId);
    this.errorCounts.delete(parcelId);
    this.cleanupCallbacks.delete(parcelId);
  }

  // Cleanup all tracking (for app shutdown)
  cleanupAll() {
    console.log('🧹 Cleaning up all tracking services');
    
    // Stop all intervals
    for (const [parcelId, interval] of this.trackingIntervals) {
      clearInterval(interval);
    }
    
    for (const [parcelId, interval] of this.demoIntervals) {
      clearInterval(interval);
    }
    
    // Clear all maps
    this.trackingIntervals.clear();
    this.demoIntervals.clear();
    this.isTracking.clear();
    this.isDemoActive.clear();
    this.errorCounts.clear();
    this.cleanupCallbacks.clear();
    
    // Reset presentation mode
    this.presentationMode = false;
  }
}

// Create singleton instance
const trackingService = new TrackingService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  trackingService.cleanupAll();
});

export default trackingService; 