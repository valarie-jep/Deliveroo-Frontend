import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => (
  <nav className={styles.navbar}>
    <div className={styles.logo}>Deliveroo</div>
    <div className={styles.links}>
      <Link to="/" className={styles.link}>Home</Link>
      <a href="#how" className={styles.link}>How it Works</a>
      <a href="#pricing" className={styles.link}>Pricing</a>
      <Link to="/login" className={styles.link}>Login</Link>
      <Link to="/register" className={styles.link}>Register</Link>
    </div>
  </nav>
);

export default Navbar;