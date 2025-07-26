import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import styles from './Navbar.module.css';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className="flex-shrink-0 text-2xl font-bold text-orange-500">
            <Link to="/">📦 Deliveroo</Link>
          </div>
        <div className={styles.links}>
          {!user ? (
            <>
              <Link to="/" className={styles.link}>Home</Link>
              <a href="#how" className={styles.link}>How it Works</a>
              <a href="#pricing" className={styles.link}>Pricing</a>
              <Link to="/login" className={styles.link}>Login</Link>
              <Link to="/register" className={styles.link}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/" className={styles.link}>Home</Link>
              <Link to="/parcels" className={styles.link}>My Parcels</Link>
              <Link to="/profile" className={styles.link}>Profile</Link>
              <button onClick={handleLogout} className={styles.link} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
