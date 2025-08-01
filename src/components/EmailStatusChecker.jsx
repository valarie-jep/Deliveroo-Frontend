import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config/api';

const EmailStatusChecker = () => {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEmailSystem();
  }, []);

  const checkEmailSystem = async () => {
    try {
      setStatus('checking');
      
      // Check environment configuration
      const envCheck = {
        apiUrl: !!BASE_URL,
        emailEnabled: process.env.REACT_APP_EMAIL_ENABLED !== 'false'
      };

      // Check backend health
      const healthResponse = await fetch(`${BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const healthData = await healthResponse.json();

      // Check email endpoint
      const emailResponse = await fetch(`${BASE_URL}/email/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const emailData = await emailResponse.json();

      setDetails({
        environment: envCheck,
        backend: {
          status: healthResponse.status,
          data: healthData
        },
        email: {
          status: emailResponse.status,
          data: emailData
        }
      });

      if (healthResponse.ok && emailResponse.ok) {
        setStatus('healthy');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      setDetails({ error: error.message });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'not_implemented': return '⚠️';
      case 'checking': return '⏳';
      default: return '❓';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Working';
      case 'error': return 'Failed';
      case 'not_implemented': return 'Not Implemented';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'not_implemented': return 'text-yellow-600';
      case 'checking': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getRecommendations = () => {
    const recommendations = [];

    if (status.environment === 'error') {
      recommendations.push('Check environment variables (REACT_APP_API_URL, REACT_APP_EMAIL_ENABLED)');
    }

    if (status.api === 'error') {
      recommendations.push('Backend API is not accessible. Check server status and API URL.');
    }

    if (status.auth === 'error') {
      recommendations.push('User not authenticated. Please log in again.');
    }

    if (status.email === 'not_implemented') {
      recommendations.push('Email service not implemented on backend. Contact backend team.');
    }

    if (status.email === 'error') {
      recommendations.push('Email service is not working. Check SendGrid configuration.');
    }

    if (recommendations.length === 0) {
      recommendations.push('All systems are working correctly!');
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Email System Status</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking email system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Email System Status</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium">Environment Configuration</span>
          <span className={`flex items-center ${getStatusColor(status.environment)}`}>
            {getStatusIcon(status.environment)} {getStatusText(status.environment)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">API Connectivity</span>
          <span className={`flex items-center ${getStatusColor(status.api)}`}>
            {getStatusIcon(status.api)} {getStatusText(status.api)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Authentication</span>
          <span className={`flex items-center ${getStatusColor(status.auth)}`}>
            {getStatusIcon(status.auth)} {getStatusText(status.auth)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Email Service</span>
          <span className={`flex items-center ${getStatusColor(status.email)}`}>
            {getStatusIcon(status.email)} {getStatusText(status.email)}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Debug Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• API URL: {details.apiUrl || 'Not set'}</p>
          <p>• Email Enabled: {details.emailEnabled ? 'Yes' : 'No'}</p>
          <p>• Authentication Token: {details.hasToken ? 'Present' : 'Missing'}</p>
          <p>• Timestamp: {details.timestamp}</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          {getRecommendations().map((rec, index) => (
            <li key={index}>• {rec}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={checkEmailSystem}
        className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Refresh Status
      </button>
    </div>
  );
};

export default EmailStatusChecker; 