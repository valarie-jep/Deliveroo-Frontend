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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send parcel created email:', error);
      throw error;
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send status update email:', error);
      throw error;
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send delivery confirmation email:', error);
      throw error;
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      throw error;
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send location update email:', error);
      throw error;
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  // Send test email
  async sendTestEmail(userEmail) {
    try {
      console.log('Attempting to send test email to:', userEmail);
      console.log('Using base URL:', this.baseURL);
      
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
      
      console.log('Test email response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Test email error response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Email service unavailable'}`);
      }
      
      const result = await response.json();
      console.log('Test email success response:', result);
      return result;
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw error;
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