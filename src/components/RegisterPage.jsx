import { useState } from "react";
import RegisterForm from "./auth/RegisterForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/authSlice"; 
import Navbar from './Navbar';

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

  // Name validation
  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  } else if (formData.name.length < 2) {
    newErrors.name = "Name must be at least 2 characters";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Invalid email address";
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10,13}$/;
  if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(formData.phone)) {
    newErrors.phone = "Phone number must be 10–13 digits";
  }

  // Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (!passwordRegex.test(formData.password)) {
    newErrors.password = "Password must be at least 8 characters, include letters and numbers";
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
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
    <>
      <Navbar />
    <RegisterForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errors={errors}
      isLoading={isLoading}
    />
    </>
  );
};

export default RegisterPage;
