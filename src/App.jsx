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
      <Routes>
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
