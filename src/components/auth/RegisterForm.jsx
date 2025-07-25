import InputField from "./InputField";
import AuthForm from "./AuthForm";
import { Link } from "react-router-dom";

const RegisterForm = ({
  formData,
  handleChange,
  handleSubmit,
  errors,
  isLoading,
}) => {
  return (
    <AuthForm title="Create a new account" onSubmit={handleSubmit}>
      <InputField
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <InputField
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <div>
      {errors.general && (
        <div className="text-red-500 text-sm text-center mb-2">
          {errors.general}
        </div>
      )}
      </div>
      <div>
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </div>
      <div className="text-center mt-4">
        <Link
          className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-700"
          to="/login"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </AuthForm>
  );
};

export default RegisterForm;
