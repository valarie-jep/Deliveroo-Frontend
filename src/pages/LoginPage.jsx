import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import LoginForm from "../components/auth/LoginForm";
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token , user} = useSelector((state) => state.auth);

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
  if (error) {
  }
  if (token && user) {
    if (user.admin) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/parcels", { replace: true });
    }
  }
}, [token, user, navigate, error]);



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
