import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import emailService from '../services/emailService';

const EmailPreferences = () => {
  const user = useSelector((state) => state.auth.user);
  const [preferences, setPreferences] = useState({
    parcelCreated: true,
    statusUpdates: true,
    deliveryConfirmation: true,
    cancellation: true,
    locationUpdates: true,
    marketing: false,
    weeklyDigest: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadEmailPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(''); // Clear any previous messages
      
      const userPreferences = await emailService.getEmailPreferences(user.id);
      
      // Ensure we have all required properties with default values
      if (userPreferences && typeof userPreferences === 'object') {
        setPreferences({
          parcelCreated: userPreferences.parcelCreated ?? true,
          statusUpdates: userPreferences.statusUpdates ?? true,
          deliveryConfirmation: userPreferences.deliveryConfirmation ?? true,
          cancellation: userPreferences.cancellation ?? true,
          locationUpdates: userPreferences.locationUpdates ?? true,
          marketing: userPreferences.marketing ?? false,
          weeklyDigest: userPreferences.weeklyDigest ?? false,
        });
      } else {
        // If API returns null/undefined, keep default preferences
        console.warn('Email preferences API not available, using default preferences');
        setMessage('Email preferences API not available. Using default settings.');
      }
    } catch (error) {
      console.error('Failed to load email preferences:', error);
      setMessage('Email preferences service is currently unavailable. Using default settings.');
      // Keep default preferences on error
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadEmailPreferences();
    }
  }, [user, loadEmailPreferences]);

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage('');
      await emailService.updateEmailPreferences(user.id, preferences);
      setMessage('Email preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update email preferences:', error);
      setMessage('Email preferences service is currently unavailable. Your changes will be saved locally.');
      // Store preferences locally as fallback
      localStorage.setItem('emailPreferences', JSON.stringify(preferences));
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setLoading(true);
      setMessage('');
      await emailService.sendTestEmail(user.email);
      setMessage('Test email sent successfully!');
    } catch (error) {
      console.error('Failed to send test email:', error);
      setMessage('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center p-4">Please log in to manage email preferences.</div>;
  }

  // Show loading state while preferences are being loaded
  if (loading) {
    return <div className="text-center p-4">Loading email preferences...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">Email Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Parcel Created</h3>
            <p className="text-sm text-gray-600">Get notified when a new parcel is created</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.parcelCreated}
              onChange={() => handlePreferenceChange('parcelCreated')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Status Updates</h3>
            <p className="text-sm text-gray-600">Get notified when parcel status changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.statusUpdates}
              onChange={() => handlePreferenceChange('statusUpdates')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Delivery Confirmation</h3>
            <p className="text-sm text-gray-600">Get notified when parcel is delivered</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.deliveryConfirmation}
              onChange={() => handlePreferenceChange('deliveryConfirmation')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Cancellation</h3>
            <p className="text-sm text-gray-600">Get notified when parcel is cancelled</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.cancellation}
              onChange={() => handlePreferenceChange('cancellation')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Location Updates</h3>
            <p className="text-sm text-gray-600">Get notified when parcel location changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.locationUpdates}
              onChange={() => handlePreferenceChange('locationUpdates')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Marketing Emails</h3>
            <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={() => handlePreferenceChange('marketing')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Weekly Digest</h3>
            <p className="text-sm text-gray-600">Receive weekly summary of your parcels</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.weeklyDigest}
              onChange={() => handlePreferenceChange('weeklyDigest')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition disabled:bg-orange-300"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
        
        <button
          onClick={handleTestEmail}
          disabled={loading}
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </button>
      </div>
    </div>
  );
};

export default EmailPreferences; 