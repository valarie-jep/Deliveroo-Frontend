import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import LoginForm from "../components/auth/LoginForm";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, token, user } = useSelector((state) => state.auth);

  // 🧠 Get the original page user tried to visit
  const from = location.state?.from?.pathname || (user?.admin ? "/admin" : "/parcels");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // ✅ Redirect after successful login
  useEffect(() => {
    if (token && user) {
      navigate(from, { replace: true });
    }
  }, [token, user, navigate, from]);

  return (
    <>
      <Navbar />
      <LoginForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errors={error ? { general: error } : {}}
        isLoading={loading}
      />
    </>
  );
};

export default LoginPage;
