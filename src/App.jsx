import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import CreateParcelPage from './pages/CreateParcelPage';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import Landing from './pages/Landing.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

const Login = () => <LoginPage />;
const Register = () => <RegisterPage />;
const Dashboard = () => <div>Dashboard Page</div>;
const Parcel = () => <div>Parcel Details Page</div>;
const Admin = () => <div>Admin Page</div>;

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/parcel/:id"
          element={
            <PrivateRoute>
              <Parcel />
            </PrivateRoute>
          }
        />
        <Route
          path="/parcels/new"
          element={
            <PrivateRoute>
              <CreateParcelPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;