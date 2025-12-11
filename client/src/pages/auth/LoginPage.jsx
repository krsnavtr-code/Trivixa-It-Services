import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [message, setMessage] = useState(location.state?.message || "");
  const searchParams = new URLSearchParams(location.search);
  const error = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (error === "not_approved") {
      setMessage(
        "Your account is pending admin approval. Please contact support."
      );
    } else if (error === "account_suspended") {
      setMessage("Your account has been deactivated. Please contact support.");
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const loginResponse = await login(formData.email, formData.password);
      if (loginResponse) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2 border border-white/20">
        {/* Left Section */}
        <div className="text-black dark:text-white flex flex-col justify-center p-10 relative">
          {/* Home Icon */}
          <Link
            to="/"
            className="absolute top-5 left-6 text-gray-700 dark:text-gray-200 hover:text-blue-500 transition hover:-translate-y-1"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 1.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 9.414V17a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1V9.414l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Welcome to <span className="text-blue-600">Trivixa</span>
          </h1>

          <p className="text-base opacity-90 leading-relaxed">
            Transform your vision into a high-performance, fully functional
            website with Trivixa.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-10 flex flex-col justify-center bg-white dark:bg-gray-950">
          {message && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                error
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-800 dark:text-gray-300 gap-2">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4"
                />
                Remember me
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg font-semibold text-white transition transform hover:-translate-y-1 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg"
              }`}
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Bottom Link */}
          <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
