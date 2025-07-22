import InputField from "./InputField";
import AuthForm from "./AuthForm";
import { Link } from "react-router-dom";

const LoginForm = ({
  formData,
  handleChange,
  handleSubmit,
  errors,
  isLoading,
}) => {
  return (
    <AuthForm title="Sign in to your account" onSubmit={handleSubmit}>
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
        <Link
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          to="/forgot-password"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-800 font-bold"
          >
            Register here
          </Link>
        </p>
      </div>
    </AuthForm>
  );
};

export default LoginForm;
