# Secure Backend Email Implementation

## 🚨 Why Frontend Email is Not Secure

### Security Issues:
1. **API Key Exposure**: SendGrid API key visible in browser
2. **No Rate Limiting**: Users can spam emails
3. **No Validation**: Anyone can use your API key
4. **Cost Risk**: Malicious users can exhaust your quota
5. **CORS Issues**: SendGrid may block browser requests

## ✅ Secure Backend Implementation

### 1. Backend Email Service (Python/Flask)

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

### 2. Backend Environment Variables

```env
# backend/.env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

### 3. Backend Email Endpoints

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
        username = data.get('username')
        
        # Validate user owns the parcel
        current_user_id = get_jwt_identity()
        if parcel_data.get('user_id') != current_user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Send email
        html_content = create_parcel_email_template(parcel_data, username)
        success = email_service.send_email(user_email, 'Parcel Created! 📦', html_content)
        
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@email_bp.route('/email/test', methods=['POST'])
@jwt_required()
def send_test_email():
    try:
        data = request.get_json()
        user_email = data.get('user_email')
        
        # Rate limiting check
        if not check_rate_limit(user_email):
            return jsonify({'error': 'Rate limit exceeded'}), 429
        
        html_content = create_test_email_template()
        success = email_service.send_email(user_email, 'Test Email 📧', html_content)
        
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### 4. Frontend Email Service (Updated)

```javascript
// src/services/emailService.js (Updated for Backend)
class EmailService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
  }

  getAuthToken() {
    return localStorage.getItem('token') || '';
  }

  async sendParcelCreatedEmail(parcelData, userEmail, username) {
    try {
      const response = await fetch(`${this.baseURL}/email/parcel-created`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          parcel_data: parcelData,
          user_email: userEmail,
          username: username
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send parcel created email:', error);
    }
  }

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to send test email:', error);
    }
  }
}
```

## 🔒 Security Benefits

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
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@email_bp.route('/email/test', methods=['POST'])
@limiter.limit("5 per minute")  # Max 5 test emails per minute
@jwt_required()
def send_test_email():
    # ... email sending logic
```

## 📋 Implementation Steps

### 1. Backend Setup:
```bash
# Install SendGrid in backend
pip install sendgrid

# Add environment variables
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@yourdomain.com
```

### 2. Frontend Changes:
- Remove SendGrid API key from frontend `.env`
- Update email service to call backend endpoints
- Remove direct SendGrid calls

### 3. Environment Variables:

**Backend (.env):**
```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=your_verified_email@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBNnN0LUAE0AyAYKA5sAfYyRdTAW5CklrQ
REACT_APP_API_URL=https://deliveroo-server.onrender.com
# Remove SendGrid API key from frontend
```

## 🎯 Recommendation

**For Production**: Use backend email service
**For Development**: Frontend email is fine for testing

Would you like me to help you implement the secure backend email service? 