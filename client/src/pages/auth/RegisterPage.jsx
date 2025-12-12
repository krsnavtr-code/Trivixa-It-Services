import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/login", {
      state: { message: "Registration successful! You can LogIn now" },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-[#0a0f2d] relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white dark:bg-white/5 backdrop-blur-2xl shadow-2xl dark:shadow-none rounded-2xl overflow-hidden grid md:grid-cols-2 border border-gray-100 dark:border-white/10"
      >
        {/* Left Section: Branding & Visuals */}
        <div className="relative hidden md:flex flex-col justify-center p-12 bg-blue-600 dark:bg-[#05081a] overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>

            <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
              Trivixa Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                Revolution
              </span>
            </h1>

            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Transform your vision into a high-performance, fully functional
              website with Trivixa.
            </p>

            <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-sm text-white/90 italic">
                "The journey of a thousand miles begins with a single step.
                Start yours here."
              </p>
            </div>

            <div className="mt-6 opacity-70 hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Right Section: Register Form Component */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#0a0f2d]/50">
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
