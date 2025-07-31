class EmailService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
  }

  // Get JWT token from localStorage or Redux store
  getAuthToken() {
    return localStorage.getItem('token') || '';
  }

  // Send parcel created email
  async sendParcelCreatedEmail(parcelData, userEmail) {
    try {
      const response = await fetch(`${this.baseURL}/email/parcel-created`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          parcel_id: parcelData.id,
          user_email: userEmail
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send parcel created email:', error);
    }
  }

  // Send status update email
  async sendStatusUpdateEmail(parcelId, userEmail, oldStatus, newStatus) {
    try {
      const response = await fetch(`${this.baseURL}/email/status-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          parcel_id: parcelId,
          user_email: userEmail,
          old_status: oldStatus,
          new_status: newStatus
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }
  }

  // Send delivery confirmation email
  async sendDeliveryConfirmationEmail(parcelData, userEmail) {
    try {
      const response = await fetch(`${this.baseURL}/email/delivery-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          parcel_id: parcelData.id,
          user_email: userEmail
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send delivery confirmation email:', error);
    }
  }

  // Send cancellation email
  async sendCancellationEmail(parcelData, userEmail) {
    try {
      const response = await fetch(`${this.baseURL}/email/parcel-cancelled`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          parcel_id: parcelData.id,
          user_email: userEmail
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
    }
  }

  // Send location update email
  async sendLocationUpdateEmail(parcelData, userEmail, newLocation) {
    try {
      const response = await fetch(`${this.baseURL}/email/location-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          parcel_id: parcelData.id,
          user_email: userEmail,
          new_location: newLocation
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send location update email:', error);
    }
  }

  // Send welcome email (no auth required)
  async sendWelcomeEmail(userEmail, username) {
    try {
      const response = await fetch(`${this.baseURL}/email/welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_email: userEmail,
          username: username
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      const response = await fetch(`${this.baseURL}/email/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  // Send test email
  async sendTestEmail(userEmail) {
    try {
      const response = await fetch(`${this.baseURL}/email/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          user_email: userEmail
        })
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send test email:', error);
    }
  }

  // Get email preferences
  async getEmailPreferences(userId) {
    try {
      const response = await fetch(`${this.baseURL}/email/preferences/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.warn(`Email preferences API returned status: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get email preferences:', error);
      // Return null to indicate failure, component will use defaults
      return null;
    }
  }

  // Update email preferences
  async updateEmailPreferences(userId, preferences) {
    try {
      const response = await fetch(`${this.baseURL}/email/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(preferences)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to update email preferences:', error);
      throw error;
    }
  }
}

const emailService = new EmailService();
export default emailService; 