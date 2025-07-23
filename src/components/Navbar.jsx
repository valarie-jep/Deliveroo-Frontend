import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
        <div>
            <Link to="/">Deliveroo</Link>
        </div>
        <div>
            <Link to="/">Home</Link>
            <Link to="/parcels">My Parcels</Link>
            <Link to="/login">LogIn</Link>
            <Link to="/register">Get Started</Link>
            <Link to="/contactUs">Contact Us</Link>
            
        </div>
    </nav>
  )
}

export default Navbar