import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError("You must be logged in to view this page.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Navbar/>
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-orange-600">Your Profile</h2>
      <ul className="space-y-2 text-gray-800">
        <li>
          <strong>Username:</strong> {profile.username}
        </li>
        <li>
          <strong>Email:</strong> {profile.email}
        </li>
        <li>
          <strong>Phone Number:</strong> {profile.phone_number}
        </li>
        <li>
          <strong>Role:</strong> {profile.admin ? "Admin" : "User"}
        </li>
      </ul>
    </div>
    </div>
  );
};

export default Profile;
