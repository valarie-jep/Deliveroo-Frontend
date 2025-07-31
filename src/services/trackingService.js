class TrackingService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
    this.activeTrackers = new Map();
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

  // Demo mode for presentation
  startDemo(parcelId, onUpdate) {
    console.log('🎬 Starting demo mode for real-time tracking');
    
    const demoUpdates = [
      { 
        status: 'pending', 
        current_location: 'Warehouse - Sorting Center',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'pending', 
        current_location: 'Loading Dock - Ready for Pickup',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'pending', 
        current_location: 'Courier Assigned - En Route to Pickup',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'in_transit', 
        current_location: 'Picked up from sender',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Nairobi Central',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Thika Road',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Juja Junction',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'in_transit', 
        current_location: 'In transit - Thika Town Center',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'in_transit', 
        current_location: 'Approaching destination',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'in_transit', 
        current_location: 'Out for delivery',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      },
      { 
        status: 'delivered', 
        current_location: 'Delivered to recipient',
        estimated_delivery: '2025-02-08T19:40:24Z',
        last_updated: new Date().toISOString()
      }
    ];

    let updateIndex = 0;
    const demoInterval = setInterval(() => {
      if (updateIndex < demoUpdates.length) {
        const update = demoUpdates[updateIndex];
        console.log(`🎬 Demo update ${updateIndex + 1}:`, update);
        
        if (onUpdate) {
          onUpdate(update);
        }
        
        updateIndex++;
      } else {
        clearInterval(demoInterval);
        console.log('✅ Demo completed!');
      }
    }, 5000); // Update every 5 seconds for demo

    return demoInterval;
  }
}

const trackingService = new TrackingService();
export default trackingService; 