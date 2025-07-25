import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import LoginForm from "./auth/LoginForm";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

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
  console.log("token:", token);
  console.log("user:", user);
  if (token && user) {
    if (user.admin) {
      navigate(from || "/", { replace: true });
    } else {
      navigate(from || "/dashboard", { replace: true });
    }
  }
}, [token, user, navigate, from]);



  return (
    <LoginForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={error ? { general: error } : {}}
      isLoading={loading}
    />
  );
};

export default LoginPage;
