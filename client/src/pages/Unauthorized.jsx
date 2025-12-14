import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaHome, FaShieldAlt } from "react-icons/fa";

export default function Unauthorized() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] flex items-center justify-center relative overflow-hidden transition-colors duration-500">
      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F47C26]/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>

        {/* Tech Grid Floor */}
        <div
          className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-200 via-transparent to-transparent dark:from-[#05081a] dark:to-transparent opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(128,128,128,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-lg w-full bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center shadow-2xl dark:shadow-none relative overflow-hidden"
        >
          {/* Top Warning Stripe */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-[#F47C26] to-red-500"></div>

          {/* Icon Container */}
          <div className="relative mb-8 inline-block">
            <motion.div
              variants={iconVariants}
              className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center border border-red-100 dark:border-red-500/20 shadow-inner"
            >
              <FaLock className="text-4xl text-red-500 dark:text-red-400" />
            </motion.div>

            {/* Pulsing Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping opacity-75"></div>

            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-[#0a0f2d] p-2 rounded-full border border-gray-100 dark:border-white/10 shadow-lg">
              <FaShieldAlt className="text-[#F47C26] text-lg" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            You do not have the necessary permissions to view this secure area.
            This incident has been logged for security purposes.
          </p>

          {/* Visual Context: Access Control */}
          <div className="mb-8 opacity-80 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5"></div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              <FaHome /> Return Home
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">
              Error Code: 403_FORBIDDEN
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
