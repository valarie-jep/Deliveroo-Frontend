# Email Functionality Setup Guide

This guide explains how to set up and use the email functionality in the Deliveroo frontend application.

## Overview

The email functionality provides automated email notifications for various parcel events and user actions. It includes:

- **Parcel Creation Emails**: Sent when a new parcel is created
- **Status Update Emails**: Sent when parcel status changes
- **Delivery Confirmation Emails**: Sent when parcels are delivered
- **Cancellation Emails**: Sent when parcels are cancelled
- **Location Update Emails**: Sent when parcel location changes
- **Welcome Emails**: Sent to new users
- **Password Reset Emails**: Sent for password recovery
- **Test Emails**: For testing email functionality

## Backend API Requirements

The frontend expects the following email endpoints on your backend:

### Email Endpoints

```
POST /email/parcel-created
POST /email/status-update
POST /email/delivery-confirmation
POST /email/parcel-cancelled
POST /email/location-update
POST /email/welcome
POST /email/password-reset
POST /email/test
GET /email/preferences/{userId}
PUT /email/preferences/{userId}
```

### Request/Response Format

#### Parcel Created Email
```json
POST /email/parcel-created
{
  "parcelId": 123,
  "recipientEmail": "user@example.com",
  "pickupLocation": "Nairobi, Kenya",
  "destinationLocation": "Mombasa, Kenya",
  "trackingId": 123
}
```

#### Status Update Email
```json
POST /email/status-update
{
  "parcelId": 123,
  "recipientEmail": "user@example.com",
  "oldStatus": "pending",
  "newStatus": "in-transit",
  "pickupLocation": "Nairobi, Kenya",
  "destinationLocation": "Mombasa, Kenya",
  "trackingId": 123
}
```

#### Email Preferences
```json
GET /email/preferences/{userId}
Response: {
  "parcelCreated": true,
  "statusUpdates": true,
  "deliveryConfirmation": true,
  "cancellation": true,
  "locationUpdates": true,
  "marketing": false,
  "weeklyDigest": false
}

PUT /email/preferences/{userId}
{
  "parcelCreated": true,
  "statusUpdates": true,
  "deliveryConfirmation": true,
  "cancellation": true,
  "locationUpdates": true,
  "marketing": false,
  "weeklyDigest": false
}
```

## Frontend Components

### EmailService (`src/services/emailService.js`)

The main service that handles all email-related API calls:

```javascript
import emailService from '../services/emailService';

// Send parcel created email
await emailService.sendParcelCreatedEmail(parcelData);

// Send status update email
await emailService.sendStatusUpdateEmail(parcelData, newStatus);

// Send delivery confirmation
await emailService.sendDeliveryConfirmationEmail(parcelData);

// Send cancellation email
await emailService.sendCancellationEmail(parcelData);

// Send location update email
await emailService.sendLocationUpdateEmail(parcelData, newLocation);

// Send welcome email
await emailService.sendWelcomeEmail(userData);

// Send password reset email
await emailService.sendPasswordResetEmail(email);

// Get email preferences
const preferences = await emailService.getEmailPreferences(userId);

// Update email preferences
await emailService.updateEmailPreferences(userId, preferences);
```

### EmailPreferences Component

Allows users to manage their email notification preferences:

```jsx
import EmailPreferences from '../components/EmailPreferences';

<EmailPreferences />
```

Features:
- Toggle switches for different email types
- Save preferences to backend
- Send test email functionality
- Real-time feedback

### PasswordReset Component

Handles password reset functionality:

```jsx
import PasswordReset from '../components/PasswordReset';

<PasswordReset />
```

Features:
- Email input validation
- Success/error messaging
- Confirmation screen
- Resend functionality

### EmailNotification Component

Displays email-related notifications:

```jsx
import EmailNotification from '../components/EmailNotification';

<EmailNotification 
  type="success"
  message="Email sent successfully!"
  onClose={() => setNotification(null)}
  autoClose={true}
  duration={5000}
/>
```

### EmailSettings Page

Main page that combines all email functionality:

```jsx
import EmailSettings from '../pages/EmailSettings';

// Route: /email-settings
```

Features:
- Tabbed interface for different email functions
- Email preferences management
- Password reset functionality
- Test email sending
- Support information

## Integration with Redux

The email functionality is integrated into the Redux parcel slice:

### Automatic Email Triggers

1. **Parcel Creation**: Automatically sends email when `createParcel` action succeeds
2. **Parcel Cancellation**: Automatically sends email when `cancelParcel` action succeeds
3. **Status Updates**: Automatically sends email when `updateParcelStatus` action succeeds
4. **Location Updates**: Automatically sends email when `updateParcelLocation` action succeeds

### Error Handling

All email operations are wrapped in try-catch blocks to prevent email failures from breaking the main functionality:

```javascript
try {
  await emailService.sendParcelCreatedEmail(parcelWithUserEmail);
} catch (error) {
  console.error('Failed to send parcel created email:', error);
  // Email failure doesn't break the main operation
}
```

## User Interface

### Navigation

The email settings are accessible via:
- Navbar link: "Email Settings"
- Direct URL: `/email-settings`

### Email Settings Page Layout

1. **Email Preferences Tab**
   - Toggle switches for different email types
   - Save preferences button
   - Test email button

2. **Password Reset Tab**
   - Email input form
   - Success confirmation screen
   - Error handling

3. **Test Email Tab**
   - Test email functionality
   - Information about test emails
   - Troubleshooting tips

4. **Support Section**
   - Common issues and solutions
   - Email troubleshooting guide

## Email Templates (Backend Implementation)

The backend should implement email templates for:

### Parcel Created Email
```
Subject: Your parcel has been created successfully
Body: 
- Parcel ID and tracking number
- Pickup and destination locations
- Estimated delivery time
- Tracking link
```

### Status Update Email
```
Subject: Your parcel status has been updated
Body:
- Parcel ID
- Old status → New status
- Current location
- Estimated delivery time
- Tracking link
```

### Delivery Confirmation Email
```
Subject: Your parcel has been delivered!
Body:
- Parcel ID
- Delivery confirmation
- Delivery location
- Delivery time
- Feedback request
```

### Cancellation Email
```
Subject: Your parcel has been cancelled
Body:
- Parcel ID
- Cancellation reason
- Refund information
- Contact support
```

### Welcome Email
```
Subject: Welcome to Deliveroo!
Body:
- Welcome message
- Getting started guide
- Support contact
- App features overview
```

### Password Reset Email
```
Subject: Reset your password
Body:
- Reset link
- Link expiration time
- Security notice
- Contact support
```

## Testing

### Manual Testing

1. **Create a parcel** and check if confirmation email is sent
2. **Update parcel status** and verify status update email
3. **Cancel a parcel** and confirm cancellation email
4. **Update parcel location** and check location update email
5. **Test email preferences** by toggling switches
6. **Send test email** to verify email functionality
7. **Reset password** to test password reset email

### Automated Testing

```javascript
// Test email service
describe('EmailService', () => {
  test('should send parcel created email', async () => {
    const parcelData = { id: 1, user_email: 'test@example.com' };
    await emailService.sendParcelCreatedEmail(parcelData);
    // Verify API call was made
  });
});
```

## Troubleshooting

### Common Issues

1. **Emails not being sent**
   - Check backend email service configuration
   - Verify API endpoints are working
   - Check user email preferences

2. **Emails going to spam**
   - Configure proper SPF/DKIM records
   - Use reputable email service provider
   - Add sender to contacts

3. **Email preferences not saving**
   - Check backend preferences endpoint
   - Verify user authentication
   - Check browser console for errors

4. **Test emails failing**
   - Verify backend email service is running
   - Check email service credentials
   - Test with different email addresses

### Debug Steps

1. **Check browser console** for API errors
2. **Verify backend logs** for email service errors
3. **Test API endpoints** directly with Postman
4. **Check email service** configuration
5. **Verify user authentication** and permissions

## Security Considerations

1. **Email Validation**: Always validate email addresses
2. **Rate Limiting**: Implement rate limiting for email endpoints
3. **Authentication**: Require authentication for email operations
4. **Input Sanitization**: Sanitize all email inputs
5. **Error Handling**: Don't expose sensitive information in errors

## Performance Optimization

1. **Async Operations**: All email operations are asynchronous
2. **Error Isolation**: Email failures don't break main functionality
3. **Caching**: Cache email preferences to reduce API calls
4. **Batch Operations**: Consider batching multiple emails

## Future Enhancements

1. **Email Templates**: Allow users to customize email templates
2. **Email Scheduling**: Schedule emails for specific times
3. **Email Analytics**: Track email open rates and engagement
4. **Bulk Operations**: Send emails to multiple recipients
5. **Email Attachments**: Support for email attachments
6. **Multi-language**: Support for multiple languages

## Support

For email functionality support:

1. Check this documentation
2. Review backend email service logs
3. Test with different email providers
4. Verify API endpoint responses
5. Check user email preferences

---

**Note**: This email functionality requires a properly configured backend with email service integration (e.g., SendGrid, AWS SES, Nodemailer). 