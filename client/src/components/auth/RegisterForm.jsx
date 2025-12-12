import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";

const RegisterForm = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictMsg, setConflictMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setConflictMsg("");

      const userData = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: data.role || "student",
        department: data.department || "Default IT",
        phone: data.phone,
      };

      const response = await api.post("/auth/register", userData);

      toast.success("Registration successful! You can LogIn now");

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      if (status === 409) {
        setConflictMsg(
          errorMessage || "Email already registered. Go to Login page"
        );
        toast.error(errorMessage || "Email already registered.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Enter your details below to join Trivixa.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Conflict Error Alert */}
        <AnimatePresence>
          {conflictMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 text-red-700 dark:text-red-400 flex items-start gap-3 overflow-hidden"
            >
              <FaExclamationTriangle className="mt-1 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{conflictMsg}</p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-2 inline-flex items-center text-xs font-bold underline hover:text-red-800 dark:hover:text-red-300"
                >
                  Go to Login <FaArrowRight className="ml-1" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaUser />
            </div>
            <input
              id="fullname"
              type="text"
              placeholder="John Doe"
              {...register("fullname", { required: "Full name is required" })}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.fullname
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.fullname && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.fullname.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaEnvelope />
            </div>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaPhone />
            </div>
            <input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Please enter a valid phone number",
                },
              })}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaLock />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full pl-10 pr-10 py-3 border rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.password.message}
            </p>
          )}
          {/* Visual aid for strong passwords */}
          <div className="mt-2 opacity-70 hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaLock />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={`w-full pl-10 pr-10 py-3 border rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Registering as
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaBuilding />
            </div>
            <select
              id="role"
              {...register("role", { required: "Please select a role" })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 appearance-none transition-all"
              defaultValue="student"
            >
              <option value="student" className="text-gray-900">
                Individual / Student
              </option>
              <option value="teacher" className="text-gray-900">
                Organization / Teacher
              </option>
            </select>
            {/* Custom chevron if needed, or rely on browser default which is hidden by appearance-none, adding simple arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.role.message}
            </p>
          )}
          {/* Visual aid for user roles */}
          <div className="mt-2 opacity-70 hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/25 hover:-translate-y-0.5"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                Register <FaArrowRight className="text-sm" />
              </>
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
