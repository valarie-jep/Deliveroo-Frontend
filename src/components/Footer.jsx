import React from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { FaBox, FaLock, FaClock } from 'react-icons/fa';

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#1A1A1A] text-white px-6 md:px-20 py-16">
      {/* Hero CTA */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">
          Start Delivering <span className="text-orange-500">Smarter</span> Today<span className="text-orange-500">!</span>
        </h1>
        <p className="mt-4 text-gray-300">
          Join thousands of businesses and individuals who trust Deliveroo for reliable, transparent, and efficient logistics solutions.
        </p>

        {/* Icons row */}
        <div className="flex justify-center gap-10 mt-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <FaBox className="text-orange-500" />
            Weight-based pricing
          </div>
          <div className="flex items-center gap-2">
            <FaLock className="text-orange-500" />
            Secure & insured
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-orange-500" />
            Real-time tracking
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <button onClick={() => navigate('/register')}className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition">
            Create an Account →
          </button>
          <button onClick={() => navigate('/login')} className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Log In
          </button>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
          <span className="text-green-400">● No setup fees</span>
          <span className="text-orange-400">● 24/7 customer support</span>
          <span className="text-blue-400">● Cancel anytime</span>
        </div>
      </div>

      {/* Footer Grid */}
      <div className="grid md:grid-cols-5 gap-8 text-sm border-t border-gray-700 pt-12">
        {/* Brand */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 text-orange-500 text-lg font-semibold mb-2">
            <FaBox />
            Deliveroo
          </div>
          <p className="text-gray-400 mb-4">
            Your trusted logistics partner for reliable, transparent, and efficient delivery solutions.
            We connect businesses and individuals with professional courier services worldwide.
          </p>
          <p className="text-gray-400">📧 <a href="mailto:support@deliveroo.com" className="hover:underline">support@deliveroo.com</a></p>
          <p className="text-gray-400">📞 <a href="tel:+25471234567" className="hover:underline">+254 71234567</a></p>
          <p className="text-gray-400">📍 <a href="https://maps.app.goo.gl/9qAGNZu456Dx9Tw76" target="_blank" rel="noreferrer" className="hover:underline"
              >Kenya</a></p>

        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-2">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/aboutUs" className="hover:text-white">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-2">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/contactUs" className="hover:text-white">Help Center</Link></li>
            <li><Link to="/packages" className="hover:text-white">Track Package</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-2">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/privacyPolicy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/termsOfService" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/cookiePolicy" className="hover:text-white">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} Deliveroo. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;