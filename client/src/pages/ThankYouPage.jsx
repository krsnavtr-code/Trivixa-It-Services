import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaArrowRight, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  // Track Google Ads conversion
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16986190204/pOYXCKjcwfwaEPzi0qM_",
        transaction_id: "",
        value: 1.0,
        currency: "INR",
        event_callback: function () {
          console.log("Conversion tracked on thank you page");
        },
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] flex items-center justify-center px-6 relative overflow-hidden transition-colors duration-500">
      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-400/10 dark:bg-green-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-10 rounded-3xl shadow-2xl dark:shadow-none text-center relative overflow-hidden"
        >
          {/* Top Success Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-[#F47C26] to-green-400"></div>

          {/* Animated Icon */}
          <div className="mb-8 relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              <FaCheck className="text-4xl text-green-500 dark:text-green-400" />
            </motion.div>
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping opacity-50"></div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Transmission Received
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
            {state?.message || "Your request has been successfully logged."}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Our team is reviewing your data and will establish communication
            shortly.
          </p>

          {/* Visual Context: Next Steps */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 opacity-90">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Next Steps Protocol
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaHome /> Return to Command Center
            </button>

            <button
              onClick={() => navigate("/blog")}
              className="w-full py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Read Engineering Insights <FaArrowRight className="text-xs" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouPage;
