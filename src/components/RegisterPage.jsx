import { useState } from "react";
import RegisterForm from "./auth/RegisterForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/authSlice"; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const newUser = {
      username: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      password: formData.password,
    };

    try {
      const result = await dispatch(registerUser(newUser)).unwrap();
      console.log("Registration successful:", result);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ api: error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      isLoading={isLoading}
    />
  );
};

export default RegisterPage;
