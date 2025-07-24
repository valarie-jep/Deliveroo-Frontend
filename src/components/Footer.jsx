import React from 'react'
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div>
        <h1>Start Delivering Smarter Today</h1>
        <p>Join thousands of businesses and individuals who trust Deliveroo for reliable, transparent and efficient logistics solutions</p>
        <div>
          <p>Weight-based pricing</p>
          <p>Secure & insured</p>
          <p>Real-Time Tracking</p>
        </div>
        <div>
          <button>Create an Account</button>
          <button>LogIn</button>
        </div>
        <div>
          <p>No setup fees</p>
          <p>24/7 customer support</p>
          <p>Cancel anytime</p>
        </div>
        <div>
          <div>
            <h3>Deliveroo</h3>
            <p>Your trusted logistic patner for reliable, transparent, and efficient delivery solutions.
              We connect businesses and individuals with professional courier services worldwide.
            </p>
            <p><a href="mailto:support@deliveroo.com">support@deliveroo.com</a></p>
            <p><a href="tel:+25471234567">+254 71234567</a></p>
            <p><a href="https://maps.app.goo.gl/9qAGNZu456Dx9Tw76">Visit our Nairobi offices</a></p>
          </div>
          <div>
            <h3>Company</h3>
            <Link to="/aboutUs">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div>
            <h3>Support</h3>
            <Link to="/contactUs">Help center</Link>
            <Link to="/packages">Track Package</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <Link to="/privacyPolicy">Privacy Policy</Link>
            <Link to="/termsOfService">Terms of Service</Link>
            <Link to="/cookiePolicy">Cookie Policy</Link>
          </div>
          <div>
            <p>&copy; {new Date().getFullYear()} Escape Travel. All rights reserved.</p>
          </div>
        </div>
    </div>
  )
}

export default Footer