import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import EmailPreferences from '../components/EmailPreferences';
import PasswordReset from '../components/PasswordReset';
import EmailNotification from '../components/EmailNotification';
import EmailStatusChecker from '../components/EmailStatusChecker';
import emailService from '../services/emailService';
import { getEmailErrorMessage, getEmailDebugInfo } from '../utils/emailErrorHandler';

const EmailSettings = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('preferences');
  const [notification, setNotification] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 8000); // Show for 8 seconds
  };

  const tabs = [
    { id: 'preferences', label: 'Email Preferences', icon: '⚙️' },
    { id: 'password', label: 'Password Reset', icon: '🔐' },
    { id: 'test', label: 'Test Email', icon: '📧' },
    { id: 'status', label: 'System Status', icon: '🔍' },
  ];

  const handleTestEmail = async () => {
    try {
      console.log('Starting test email process...');
      
      // Get debug info
      const debug = getEmailDebugInfo();
      setDebugInfo(debug);
      console.log('Debug info:', debug);
      
      const result = await emailService.sendTestEmail(user.email);
      console.log('Test email result:', result);
      
      if (result && result.success) {
        showNotification('success', 'Test email sent successfully! Check your inbox (and spam folder).');
      } else {
        const errorMessage = result?.error || 'Unknown error occurred';
        showNotification('error', `Failed to send test email: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Test email error:', error);
      const errorMessage = getEmailErrorMessage(error);
      showNotification('error', `Failed to send test email: ${errorMessage}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Please log in to access email settings</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {notification && (
        <EmailNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-orange-500 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Email Settings</h1>
            <p className="text-orange-100">Manage your email notifications and preferences</p>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Email Preferences</h2>
                <p className="text-gray-600 mb-6">
                  Choose which email notifications you want to receive about your parcels and account.
                </p>
                <EmailPreferences />
              </div>
            )}

            {activeTab === 'password' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Password Reset</h2>
                <p className="text-gray-600 mb-6">
                  Reset your password by entering your email address. We'll send you a secure link to create a new password.
                </p>
                <PasswordReset />
              </div>
            )}

            {activeTab === 'test' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Test Email</h2>
                <p className="text-gray-600 mb-6">
                  Send a test email to verify your email settings are working correctly.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Test Email Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>• Test emails will be sent to: <strong>{user.email}</strong></p>
                        <p>• Check your spam folder if you don't receive the email</p>
                        <p>• Test emails help verify your email settings are working</p>
                        <p>• If emails fail, check the debug information below</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTestEmail}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition mb-4"
                >
                  Send Test Email
                </button>

                {debugInfo && (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Debug Information</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Email Enabled: {debugInfo.emailEnabled ? 'Yes' : 'No'}</p>
                      <p>• API URL: {debugInfo.apiUrl}</p>
                      <p>• Authentication Token: {debugInfo.hasToken ? 'Present' : 'Missing'}</p>
                      <p>• Timestamp: {debugInfo.timestamp}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'status' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Email System Status</h2>
                <p className="text-gray-600 mb-6">
                  Check the status of your email system and diagnose any issues.
                </p>
                <EmailStatusChecker />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Email Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Common Issues</h4>
              <ul className="space-y-1">
                <li>• Emails not being received</li>
                <li>• Emails going to spam folder</li>
                <li>• Incorrect email address</li>
                <li>• Email preferences not saving</li>
                <li>• Backend email service not configured</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Solutions</h4>
              <ul className="space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Add our email to your contacts</li>
                <li>• Verify your email address is correct</li>
                <li>• Clear browser cache and try again</li>
                <li>• Contact support if backend is not configured</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings; 