import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import axios from 'axios';
import LocationAutocomplete from "../components/LocationAutocomplete";
import { LoadScript } from "@react-google-maps/api";


const libraries = ["places"];

const API_BASE = process.env.REACT_APP_API_URL || '';

// SVG Icons (unchanged)
const ParcelIcon = () => (
    <svg className="w-10 h-10 text-orange-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
);
const TransitIcon = () => (
    <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13l4-4 4 4 4-4 4 4"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>
);
const DeliveredIcon = () => (
    <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
);
const getStatusClass = (status) => {
    const colorMap = {
        pending: 'text-purple-500',
        in_transit: 'text-orange-500',
        delivered: 'text-green-500',
        cancelled: 'text-red-500',
    };
    return colorMap[status?.toLowerCase()] || 'text-gray-400';
};

// Dashboard Home: Stats (unchanged)
const AdminDashboardHome = () => {
    const [stats, setStats] = useState({ total: 0, inTransit: 0, delivered: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parcels, setParcels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatsAndParcels = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/admin/parcels`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const allParcels = res.data.parcels || res.data || [];
                setStats({
                    total: allParcels.length,
                    inTransit: allParcels.filter(p => p.status && p.status.toLowerCase().replace(/\s+/g, '_') === 'in_transit').length,
                    delivered: allParcels.filter(p => p.status === 'delivered').length,
                });
                setParcels(allParcels.slice(0, 5)); // Show only 5 most recent
            } catch (err) {
                setError('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStatsAndParcels();
    }, []);

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Admin!</h1>
                <p className="text-gray-600">Manage parcels, view histories, and monitor system stats here.</p>
            </div>
            {loading ? (
                <div>Loading stats...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <ParcelIcon />
                            <span className="text-2xl font-bold">{stats.total}</span>
                            <span className="text-gray-500">Total Parcels</span>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <TransitIcon />
                            <span className="text-2xl font-bold">{stats.inTransit}</span>
                            <span className="text-gray-500">In Transit</span>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                            <DeliveredIcon />
                            <span className="text-2xl font-bold">{stats.delivered}</span>
                            <span className="text-gray-500">Delivered</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 mt-8 overflow-x-auto">
                        <h2 className="text-xl font-bold mb-4">Recent Parcels</h2>
                        {parcels.length === 0 ? (
                            <div className="text-gray-400">No parcels found.</div>
                        ) : (
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4">ID</th>
                                        <th className="py-2 px-4">Sender</th>
                                        <th className="py-2 px-4">Recipient</th>
                                        <th className="py-2 px-4">Status</th>
                                        <th className="py-2 px-4">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parcels.map((parcel) => (
                                    <tr key={parcel.id}
                                    className="border-b cursor-pointer hover:bg-gray-100 transition"
                                    onClick={() => navigate(`/admin/parcels/${parcel.id}`)} >
                                        <td className="py-2 px-4">{parcel.id}</td>
                                        <td className="py-2 px-4">{parcel.sender_name || parcel.sender || '-'}</td>
                                        <td className="py-2 px-4">{parcel.recipient_name || parcel.recipient || '-'}</td>
                                        <td className="py-2 px-4">{parcel.status}</td>
                                        <td className="py-2 px-4">{parcel.current_location || '-'}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

// Admin Parcels Page
const AdminParcels = () => {
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({});
    const [locationUpdate, setLocationUpdate] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    const fetchParcels = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/admin/parcels`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParcels(res.data.parcels || res.data || []);
        } catch (err) {
            setError('Failed to fetch parcels');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParcels();
    }, []);

    const handleStatusChange = async (id) => {
        const newStatus = statusUpdate[id];
        if (!newStatus) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE}/admin/parcels/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatusUpdate((prev) => ({ ...prev, [id]: '' }));
            fetchParcels();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    // Modified to receive the full place object from LocationAutocomplete's onLocationSelect
    const handleLocationChange = async (id, place) => {
        // Use place.address, place.lat, place.lng as needed
        const newLocation = place.address; // Or place.formatted_address if you prefer
        const lat = place.lat;
        const lng = place.lng;

        if (!newLocation) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE}/admin/parcels/${id}/location`, { current_location: newLocation, lat, lng }, { // Send lat/lng if your backend supports it
                headers: { Authorization: `Bearer ${token}` },
            });
            setLocationUpdate((prev) => ({ ...prev, [id]: '' }));
            fetchParcels();
        } catch (err) {
            alert('Failed to update location');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">All Parcels</h2>
            {/* Search and Sort Controls */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search parcels..."
                    className="border px-4 py-2 rounded w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                />

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                    <select
                        className="border px-2 py-2 rounded"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Sort By</option>
                        <option value="sender">Sender</option>
                        <option value="recipient">Recipient</option>
                        <option value="status">Status</option>
                        <option value="created_at">Created Time</option>
                    </select>
                    <button
                        onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                        className="bg-gray-200 text-sm px-3 py-2 rounded hover:bg-gray-300"
                    >
                        {sortOrder === 'asc' ? '⬆️ Asc' : '⬇️ Desc'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div>Loading parcels...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4">ID</th>
                            <th className="py-2 px-4">Sender</th>
                            <th className="py-2 px-4">Recipient</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Location</th>
                            <th className="py-2 px-4">Update Status</th>
                            <th className="py-2 px-4">Update Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...parcels]
                            .filter((parcel) =>
                                [parcel.id, parcel.sender, parcel.sender_name, parcel.recipient, parcel.recipient_name, parcel.status, parcel.current_location]
                                    .some((field) => field?.toString().toLowerCase().includes(searchTerm))
                            )
                            .sort((a, b) => {
                                if (!sortBy) return 0;
                                const valA = a[sortBy]?.toString().toLowerCase() || '';
                                const valB = b[sortBy]?.toString().toLowerCase() || '';
                                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                                return 0;
                            })
                            .map((parcel) => (
                                <tr key={parcel.id}>
                                    <td className="border-b cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => navigate(`/admin/parcels/${parcel.id}`)}>{parcel.id}</td>
                                    <td className="border-b cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => navigate(`/admin/parcels/${parcel.id}`)}>{parcel.sender_name || parcel.sender || '-'}</td>
                                    <td className="py-2 px-4">{parcel.recipient_name || parcel.recipient || '-'}</td>
                                    <td className={`py-2 px-4 font-medium ${getStatusClass(parcel.status)}`}>{parcel.status}</td>
                                    <td className="py-2 px-4">{parcel.current_location || '-'}</td>
                                    <td className="py-2 px-4">
                                        <select
                                            className="border px-2 py-1 rounded mr-2"
                                            value={statusUpdate[parcel.id] || ''}
                                            onChange={e => setStatusUpdate(prev => ({ ...prev, [parcel.id]: e.target.value }))}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="in_transit">In Transit</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            className="bg-orange-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleStatusChange(parcel.id)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                    {/* REMOVED LoadScript from here */}
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <LocationAutocomplete
                                                value={locationUpdate[parcel.id] || ''}
                                                onChange={(val) =>
                                                    setLocationUpdate((prev) => ({ ...prev, [parcel.id]: val }))
                                                }
                                                onLocationSelect={(place) => {
                                                    setLocationUpdate((prev) => ({
                                                        ...prev,
                                                        [parcel.id]: place.address, // Update input with selected address
                                                    }));
                                                    handleLocationChange(parcel.id, place); // Call handler with the full place object
                                                }}
                                                placeholder="New location"
                                                className="w-full border px-2 py-1 rounded"
                                            />
                                            {/* The update button below is now less necessary if `onLocationSelect` directly triggers `handleLocationChange` */}
                                            <button
                                              className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-400"
                                              // This onClick would now trigger with the *currently typed* value
                                              // rather than a selected suggestion's full data.
                                              // Consider if you need both or if selection is sufficient.
                                              onClick={() => handleLocationChange(parcel.id, {address: locationUpdate[parcel.id]})}
                                            >
                                              Update
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};


const AdminHistories = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistories = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/admin/histories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistories(res.data.histories || res.data || []);
            } catch (err) {
                setError('Failed to fetch histories');
            } finally {
                setLoading(false);
            }
        };
        fetchHistories();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Parcel Histories</h2>
            {loading ? (
                <div>Loading histories...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4">ID</th>
                            <th className="py-2 px-4">Parcel ID</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Location</th>
                            <th className="py-2 px-4">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories.map((h) => (
                            <tr key={h.id} className="border-b">
                                <td className="py-2 px-4">{h.id}</td>
                                <td className="py-2 px-4">{h.parcel_id}</td>
                                <td className="py-2 px-4">{h.status}</td>
                                <td className="py-2 px-4">{h.current_location || '-'}</td>
                                <td className="py-2 px-4">{h.timestamp || h.created_at || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// This is your main Admin layout component
const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        // <<< ADD LoadScript HERE, wrapping the entire admin content
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_Maps_API_KEY}
            libraries={libraries}
            language="en" // Optional: set language
            region="KE" // Optional: set region for Kenya
        >
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <div className="flex-shrink-0 text-4xl font-bold text-orange-500">
                    <Link to="/dashboard">📦 Deliveroo</Link>
                </div>
                <div className="flex flex-1 pt-16">
                    {/* Sidebar */}
                    <aside className="w-64 bg-white shadow-lg hidden md:block">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-orange-500">Admin Panel</h2>
                        </div>
                        <nav className="mt-6 space-y-2 px-6">
                            <Link to="/admin" className={`block py-2 px-4 rounded hover:bg-orange-100 font-medium text-gray-700 ${location.pathname === '/admin' ? 'bg-orange-100' : ''}`}>Dashboard</Link>
                            <Link to="/admin/parcels" className={`block py-2 px-4 rounded hover:bg-orange-100 font-medium text-gray-700 ${location.pathname === '/admin/parcels' ? 'bg-orange-100' : ''}`}>Parcels</Link>
                            <Link to="/admin/histories" className={`block py-2 px-4 rounded hover:bg-orange-100 font-medium text-gray-700 ${location.pathname === '/admin/histories' ? 'bg-orange-100' : ''}`}>Histories</Link>
                            <button onClick={handleLogout} className="block w-full text-left py-2 px-4 rounded hover:bg-orange-100 font-medium text-gray-700">Logout</button>
                        </nav>
                    </aside>
                    {/* Main Content */}
                    <main className="flex-1 p-8">
                        <Routes>
                            <Route index element={<AdminDashboardHome />} />
                            <Route path="parcels" element={<AdminParcels />} />
                            <Route path="histories" element={<AdminHistories />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </LoadScript>
    );
};

export default Admin;
