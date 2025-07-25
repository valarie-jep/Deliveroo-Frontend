import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation 
} from "react-router-dom";
import { Provider } from "react-redux";

import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import CreateParcelPage from "./pages/CreateParcelPage.jsx";
import Dashboard from "./pages/Dashboard";

import Parcels from "./pages/Parcels.jsx"
import store from './redux/store';

// Placeholder components if not implemented

const Admin = () => <div>Admin Page</div>;


const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
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
            path="/parcels"
            element={
              
                <Parcels />
              
            }
          />
          <Route
            path="/parcels/new"
            element={
              
                <CreateParcelPage />
             
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