import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from "react-router-dom";
import { FaBox, FaMapMarkerAlt, FaTimesCircle, FaSearchLocation, FaUserPlus } from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
        <Navbar/>
       <section
      className="relative bg-cover bg-center h-screen flex items-center justify-center text-white px-6"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/7362883/pexels-photo-7362883.jpeg')" 
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Deliver Your World with <span className="text-orange-500">Confidence</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-8">
          Real-time tracking, weight-based pricing, and reliable delivery at your fingertips.
          <br />Ship anywhere, anytime with our professional logistics network.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/parcels')}className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition">
            Track package
          </button>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Live tracking for 10,000+ parcels
          </div>
          <div className="flex items-center gap-2">
            🚚 98.8% on-time delivery rate
          </div>
          <div className="flex items-center gap-2">
            🏢 500+ trusted businesses
          </div>
        </div>
      </div>
    </section>
        <div className="bg-white text-black">
      {/* WHY CHOOSE */}
      <section className="text-center py-20 px-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          Why Choose <span className="text-orange-500">Deliveroo</span>?
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Experience the future of logistics with features designed for modern businesses and individuals.
        </p>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <FaBox className="text-orange-500 text-2xl" />,
              title: 'Create & Track Orders',
              desc: 'Easily create delivery orders and track them in real-time from pickup to destination with our advanced tracking system.'
            },
            {
              icon: <FaMapMarkerAlt className="text-orange-500 text-2xl" />,
              title: 'Edit Destination Anytime',
              desc: 'Change delivery address on the go. Our flexible system allows destination changes before the parcel reaches its final location.'
            },
            {
              icon: <FaTimesCircle className="text-orange-500 text-2xl" />,
              title: 'Cancel Before Delivery',
              desc: 'Need to cancel? No problem. Cancel your order before it’s out for delivery with instant refund processing.'
            },
            {
              icon: <FaSearchLocation className="text-orange-500 text-2xl" />,
              title: 'Real-Time Order Details',
              desc: 'Get complete visibility into your shipment with live updates, delivery photos, and detailed tracking history.'
            }
          ].map(({ icon, title, desc }, idx) => (
            <div key={idx} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="mb-4">{icon}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4 text-lg">Ready to streamline your delivery process?</p>
          <div className="flex justify-center gap-4">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition font-medium">
              Start Free Trial
            </button>
            <button className="border border-orange-500 text-orange-500 px-6 py-3 rounded-md hover:bg-orange-100 transition font-medium">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id='how'className="bg-gray-50 py-20 px-6">
        <h1  className="text-3xl md:text-4xl font-bold text-center">
          How It <span className="text-orange-500">Works</span>
        </h1>
        <p className="text-center text-gray-600 mt-4 mb-12">
          Get your parcels delivered in four simple steps. It’s that easy.
        </p>

        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-12 max-w-6xl mx-auto text-center">
          {[
            {
              icon: <FaUserPlus className="text-white text-xl" />,
              title: 'Create Account',
              desc: 'Sign up in minutes and verify your account to start shipping immediately.'
            },
            {
              icon: <FaBox className="text-white text-xl" />,
              title: 'Make Order',
              desc: 'Enter pickup and delivery details, package information, and schedule your delivery.'
            },
            {
              icon: <FaSearchLocation className="text-white text-xl" />,
              title: 'Track in Real-Time',
              desc: 'Monitor your parcel journey with live GPS tracking and delivery updates.'
            },
            {
              icon: <FaMapMarkerAlt className="text-white text-xl" />,
              title: 'Parcel Delivered',
              desc: 'Receive confirmation with delivery photos and digital signature.'
            }
          ].map(({ icon, title, desc }, idx) => (
            <div key={idx} className="flex-1 space-y-4">
              <div className="mx-auto bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                {icon}
              </div>
              <h4 className="font-semibold text-lg">{title}</h4>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-orange-50 py-8 px-4 rounded-xl text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-4">
            Join thousands of businesses and individuals who trust Deliveroo for their shipping needs.
          </p>
          <button onClick={() => navigate('/register')}className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition font-medium">
            Create Your Account Now
          </button>
        </div>
      </section>
    </div>
        <Footer/>
    </div>
  )
}

export default Dashboard
