import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/authSlice';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const isAdmin = user && user.admin;
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-orange-500">
            <Link to="/">📦 Deliveroo</Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 items-center">
            <Link
              to="/"
              className="hover:text-orange-500 transition duration-300"
            >
              Home
            </Link>
            {/* My Parcels: Only show for normal users and not on dashboard/landing page */}
            {user && !isAdmin && !isDashboard && (
              <Link
                to="/parcels"
                className="hover:text-orange-500 transition duration-300"
              >
                My Parcels
              </Link>
            )}
            {/* Create Parcel: Only show for normal users who are logged in and not on admin */}
            {user && !user.admin && (
              <Link
                to="/parcels/new"
                className="hover:text-orange-500 transition duration-300"
              >
                Create Parcel
              </Link>
            )}

            {/* Show if NOT logged in */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="hover:text-orange-500 transition duration-300"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Show if logged in */}
            {user && (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-100 hover:shadow transition font-semibold"
                >
                  👤 {user.name?.split(" ")[0] || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition font-semibold"
                >
                  Log Out
                </button>
              </>
            )}

            <Link
              to="/contactUs"
              className="hover:text-orange-500 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
