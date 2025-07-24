import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import CreateParcelPage from "./pages/CreateParcelPage.jsx";
import Dashboard from "./pages/Dashboard";
import authReducer from "./redux/authSlice";

// Placeholder components if not implemented
const Parcel = () => <div>Parcel Details Page</div>;
const Admin = () => <div>Admin Page</div>;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
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
              
                <Dashboard />
             
            }
          />
          <Route
            path="/parcels/:id"
            element={
              <AuthWrapper>
                <Parcel />
              </AuthWrapper>
            }
          />
          <Route
            path="/parcels/new"
            element={
              <AuthWrapper>
                <CreateParcelPage />
              </AuthWrapper>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthWrapper>
                <Admin />
              </AuthWrapper>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;