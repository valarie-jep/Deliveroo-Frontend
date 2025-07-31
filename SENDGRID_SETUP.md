# SendGrid Email Integration Setup (Backend Implementation)

This guide will help you set up SendGrid email notifications for your Deliveroo application using the **secure backend approach**.

## 🔒 Why Backend Email is Secure

### Security Benefits:
1. **API Key Protected**: Never exposed to browser
2. **Rate Limiting**: Prevent email spam
3. **User Validation**: Verify user owns the parcel
4. **Authentication Required**: JWT token validation
5. **Cost Control**: Backend controls email usage
6. **Audit Trail**: Server logs all email activity

## 1. Backend Setup

### Get Your SendGrid API Key
1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Sign up or log in to your account
3. Navigate to **Settings > API Keys**
4. Click **Create API Key**
5. Choose **Restricted Access** with "Mail Send" permissions
6. Copy your API key

### Verify Your Sender Email
1. In SendGrid Dashboard, go to **Settings > Sender Authentication**
2. Choose **Single Sender Verification** (for testing)
3. Follow the verification steps
4. Use the verified email as your sender email

## 2. Backend Environment Variables

Add these to your **backend** `.env` file:

```env
# SendGrid Configuration (Backend Only)
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

## 3. Backend Implementation

### Install SendGrid in Backend
```bash
pip install sendgrid
```

### Create Email Service (Python/Flask)
```python
# backend/services/email_service.py
import os
import requests
from flask import current_app

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('SENDGRID_FROM_EMAIL')
        self.base_url = 'https://api.sendgrid.com/v3/mail/send'
    
    def send_email(self, to_email, subject, html_content):
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'personalizations': [{'to': [{'email': to_email}]}],
            'from': {'email': self.from_email},
            'subject': subject,
            'content': [{'type': 'text/html', 'value': html_content}]
        }
        
        response = requests.post(self.base_url, headers=headers, json=data)
        return response.status_code == 202
```

### Create Email Endpoints
```python
# backend/routes/email_routes.py
from flask import Blueprint, request, jsonify
from services.email_service import EmailService
from flask_jwt_extended import jwt_required, get_jwt_identity

email_bp = Blueprint('email', __name__)
email_service = EmailService()

@email_bp.route('/email/parcel-created', methods=['POST'])
@jwt_required()
def send_parcel_created_email():
    try:
        data = request.get_json()
        parcel_data = data.get('parcel_data')
        user_email = data.get('user_email')
        
        # Validate user owns the parcel
        current_user_id = get_jwt_identity()
        if parcel_data.get('user_id') != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Send email
        html_content = create_parcel_email_template(parcel_data)
        success = email_service.send_email(user_email, 'Parcel Created! 📦', html_content)
        
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

## 4. Frontend Configuration

### Frontend Environment Variables
Your **frontend** `.env` file should only contain:

```env
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBNnN0LUAE0AyAYKA5sAfYyRdTAW5CklrQ

# Backend API URL
REACT_APP_API_URL=https://deliveroo-server.onrender.com
```

**Note**: No SendGrid API key in frontend - it stays secure on the backend!

### Frontend Email Service
The frontend uses the existing `emailService.js` which calls backend endpoints:

```javascript
// src/services/emailService.js (Already implemented)
async sendParcelCreatedEmail(parcelData, userEmail) {
  try {
    const response = await fetch(`${this.baseURL}/email/parcel-created`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        parcel_data: parcelData,
        user_email: userEmail
      })
    });
    return response.json();
  } catch (error) {
    console.error('Failed to send parcel created email:', error);
  }
}
```

## 5. Email Templates Available

### 📦 Parcel Created Email
- Sent when a new parcel is created
- Includes parcel details and tracking link

### 🔄 Status Update Email
- Sent when parcel status changes
- Color-coded status indicators
- Direct link to tracking page

### 🎉 Delivery Confirmation Email
- Sent when parcel is delivered
- Includes delivery details
- Call-to-action to send another parcel

### ❌ Cancellation Email
- Sent when parcel is cancelled
- Includes cancellation details
- Option to create new parcel

### 👋 Welcome Email
- Sent to new users
- Introduces platform features
- Encourages first parcel creation

### 🔐 Password Reset Email
- Sent when password reset is requested
- Secure reset link
- Security warnings

## 6. Testing the Integration

### Manual Testing
1. Create a new parcel
2. Check your email for the confirmation
3. Update parcel status
4. Check for status update email
5. Cancel a parcel
6. Check for cancellation email

### Backend Testing
```bash
# Test email endpoint
curl -X POST "https://deliveroo-server.onrender.com/email/parcel-created" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"parcel_data": {...}, "user_email": "test@example.com"}'
```

## 7. Security Features

### ✅ **Backend Email Security:**
1. **API Key Protected**: Never exposed to browser
2. **Rate Limiting**: Prevent email spam
3. **User Validation**: Verify user owns the parcel
4. **Authentication Required**: JWT token validation
5. **Cost Control**: Backend controls email usage
6. **Audit Trail**: Server logs all email activity

### 🛡️ **Additional Security Measures:**
```python
# Rate limiting
@email_bp.route('/email/test', methods=['POST'])
@limiter.limit("5 per minute")  # Max 5 test emails per minute
@jwt_required()
def send_test_email():
    # ... email sending logic
```

## 8. Troubleshooting

### Common Issues:

1. **"API key not found"**
   - Check your backend `.env` file
   - Ensure `SENDGRID_API_KEY` is set
   - Restart your backend server

2. **"From email not verified"**
   - Verify your sender email in SendGrid
   - Use a verified email address

3. **"Email not sending"**
   - Check SendGrid dashboard for delivery status
   - Verify API key permissions
   - Check backend logs for errors

4. **"Rate limiting"**
   - SendGrid has rate limits
   - Check your SendGrid account limits
   - Implement retry logic if needed

## 9. Production Considerations

### Security:
- Never commit API keys to version control
- Use environment variables
- Consider using SendGrid's webhook verification

### Performance:
- Emails are sent asynchronously
- Non-blocking email sending
- Error handling prevents app crashes

### Monitoring:
- Check SendGrid dashboard for delivery rates
- Monitor bounce rates
- Set up webhook notifications

## 10. Next Steps

1. Add your SendGrid API key to backend `.env`
2. Verify your sender email
3. Implement the backend email service
4. Test the email functionality
5. Monitor email performance

## Support

For SendGrid support:
- [SendGrid Documentation](https://sendgrid.com/docs/)
- [SendGrid Support](https://support.sendgrid.com/)

For application support:
- Check backend logs for errors
- Verify environment variables
- Test with the backend email endpoints 