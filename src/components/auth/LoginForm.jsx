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
        label="Username"
        type="text"
        name="username"
        value={formData.username || ""}
        onChange={handleChange}
        error={errors.username}
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password || ""}
        onChange={handleChange}
        error={errors.password}
      />
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
        <Link
          className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-700"
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
            className="text-orange-500 hover:text-orange-700 font-bold"
          >
            Register here
          </Link>
        </p>
      </div>
    </AuthForm>
  );
};

export default LoginForm;
