# Deliveroo Frontend

A modern React-based delivery tracking application that allows users to create, track, and manage parcel deliveries with real-time Google Maps integration.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Google Maps Setup](#google-maps-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### Core Functionality
- **User Authentication**: Secure login/register system with JWT tokens
- **Parcel Management**: Create, view, and track parcels
- **Real-time Tracking**: Live GPS tracking with Google Maps integration
- **Location Autocomplete**: Smart address suggestions using Google Places API
- **Admin Dashboard**: Comprehensive admin panel for parcel management
- **Responsive Design**: Mobile-first design with Tailwind CSS

### User Features
- Create new delivery parcels with pickup and destination details
- Real-time parcel tracking with map visualization
- View parcel history and status updates
- Edit parcel destinations (before pickup)
- Cancel parcels (before pickup)
- User profile management

### Admin Features
- View all parcels in the system
- Update parcel status (pending, in-transit, delivered, cancelled)
- Update parcel locations for real-time tracking
- Manage user accounts and permissions
- Comprehensive admin dashboard with statistics

## Tech Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Maps & Location
- **@react-google-maps/api** - Google Maps integration
- **Google Places API** - Address autocomplete
- **Google Geocoding API** - Address to coordinates conversion

### Development Tools
- **Create React App** - Development environment
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Google Maps API Key** (see [Google Maps Setup](#google-maps-setup))
- **Backend API** running (see API Integration section)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Deliveroo-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration (see [Environment Setup](#environment-setup))

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL
REACT_APP_API_URL=https://deliveroo-server.onrender.com
```

### Required API Keys

#### Google Maps API
You'll need to enable the following Google Maps APIs:
- **Maps JavaScript API** - For map display
- **Places API** - For address autocomplete
- **Geocoding API** - For address to coordinate conversion

See [Google Maps Setup](#google-maps-setup) for detailed instructions.

## Usage

### User Flow

1. **Registration/Login**
   - Visit the application and create an account
   - Login with your credentials

2. **Create Parcel**
   - Navigate to "Create New Parcel"
   - Fill in pickup and destination details
   - Use location autocomplete for accurate addresses
   - Submit the parcel creation form

3. **Track Parcel**
   - Use the tracking page to monitor your parcel
   - View real-time location on Google Maps
   - Check status updates and delivery progress

4. **Manage Parcels**
   - View all your parcels in the parcels list
   - Edit destinations (before pickup)
   - Cancel parcels (before pickup)

### Admin Flow

1. **Admin Login**
   - Login with admin credentials
   - Access the admin dashboard

2. **Manage Parcels**
   - View all parcels in the system
   - Update parcel status and locations
   - Monitor delivery progress

3. **User Management**
   - View user accounts and permissions
   - Manage system-wide settings

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── LocationAutocomplete.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ParcelCard.jsx
│   └── ParcelForm.jsx
├── pages/              # Page components
│   ├── Landing.jsx     # Landing page
│   ├── LoginPage.jsx   # User authentication
│   ├── Dashboard.jsx   # User dashboard
│   ├── Parcels.jsx     # Parcel listing
│   ├── CreateParcelPage.jsx
│   ├── ParcelDetails.jsx
│   ├── TrackingPage.jsx
│   ├── Admin.jsx       # Admin dashboard
│   ├── Profile.jsx     # User profile
│   └── NotFoundPage.jsx
├── redux/              # State management
│   ├── store.jsx       # Redux store configuration
│   ├── authSlice.jsx   # Authentication state
│   └── parcelSlice.jsx # Parcel management state
├── App.jsx             # Main application component
├── index.jsx           # Application entry point
└── index.css           # Global styles
```

## API Integration

The application integrates with a backend API for data management:

### Base URL
```
https://deliveroo-server.onrender.com
```

### Key Endpoints
- `POST /login` - User authentication
- `POST /register` - User registration
- `GET /parcels` - Fetch user parcels
- `POST /parcels` - Create new parcel
- `PATCH /parcels/{id}/destination` - Update parcel destination
- `PATCH /parcels/{id}/cancel` - Cancel parcel
- `PATCH /parcels/{id}/status` - Update parcel status (admin)
- `PATCH /parcels/{id}/location` - Update parcel location (admin)

### Authentication
- Uses JWT tokens for authentication
- Tokens stored in localStorage
- Automatic token refresh and logout handling

## Google Maps Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing for the project

### 2. Enable Required APIs
Enable these APIs in your Google Cloud Console:
- **Maps JavaScript API**
- **Places API**
- **Geocoding API**

### 3. Create API Key
1. Go to "Credentials" in Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Restrict the key to your domain for security
4. Copy the API key to your `.env` file

### 4. Configure Restrictions
For security, configure API key restrictions:
- **Application restrictions**: HTTP referrers
- **API restrictions**: Select only the APIs you need

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Testing Framework
- **Jest** - Test runner
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

#### GitHub Pages
1. Add `homepage` field to `package.json`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deploy scripts to `package.json`
4. Run: `npm run deploy`

### Environment Variables
Make sure to set all required environment variables in your deployment platform:
- `REACT_APP_GOOGLE_MAPS_API_KEY`
- `REACT_APP_API_URL`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Code Style
- Use ESLint for code linting
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the [Google Maps Setup Guide](GOOGLE_MAPS_SETUP.md)
- Review the API documentation

---

**Built with React, Redux, and Google Maps API**
