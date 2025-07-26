import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation 
} from "react-router-dom";
import { Provider } from "react-redux";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import CreateParcelPage from "./pages/CreateParcelPage.jsx";
import Dashboard from "./pages/Dashboard";

import Parcels from "./pages/Parcels.jsx"
import Admin from "./pages/Admin.jsx";
import store from './redux/store';
import ParcelDetails from "./pages/ParcelDetails.jsx";
import TrackingPage from "./pages/TrackingPage.jsx";
import Profile from "./pages/Profile.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx";
// Placeholder components if not implemented


const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const UserOnlyRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isAdmin = user && JSON.parse(user).admin;
  const location = useLocation();
  if (!token || isAdmin) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }
  return children;
};

const AdminRedirectRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const isAdmin = user && JSON.parse(user).admin;
  const location = useLocation();
  if (isAdmin) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <AdminRedirectRoute>
                <Dashboard />
              </AdminRedirectRoute>
            }
          />
          <Route
            path="/parcels"
            element={
              <UserOnlyRoute>
                <Parcels />
              </UserOnlyRoute>
            }
          />
          <Route
            path="/parcels/new"
            element={
                <CreateParcelPage />
            }
          />
          <Route
            path="/parcels/:id"
            element={<ParcelDetails />}
          />
          <Route
            path="/admin/*"
            element={
              <AuthWrapper>
                <Admin />
              </AuthWrapper>
            }
          />
          <Route 
          path="/tracking" 
          element={
            <AuthWrapper>
                <TrackingPage />
              </AuthWrapper>
            } />
          <Route 
          path="/profile" 
          element={
            <AuthWrapper>
                <Profile />
              </AuthWrapper>
            } />

            <Route path="/404" element={<NotFoundPage/>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;