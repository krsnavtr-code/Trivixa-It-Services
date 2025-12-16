import React, { useState } from "react";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    // console.log("Subscribed with email:", email);
    setIsSubscribed(true);
    setEmail("");

    // Reset after 5 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 5000);
  };

  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>

      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-blue-200/40 to-purple-200/40 dark:from-blue-600/20 dark:to-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          viewport={{ once: true }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl dark:shadow-none transition-colors duration-300"
        >
          {/* Decorative Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F47C26] to-transparent opacity-50"></div>

          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-white/5 flex items-center justify-center border border-orange-100 dark:border-white/10 shadow-[0_0_15px_rgba(244,124,38,0.3)]">
              <FaEnvelopeOpenText className="text-3xl text-[#F47C26]" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Stay Ahead of the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Tech Curve
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Join our exclusive community. Get the latest insights on AI, Cloud
            Architecture, and Digital Transformation delivered straight to your
            inbox.
          </p>

          <AnimatePresence mode="wait">
            {isSubscribed ? (
              <motion.div
                key="success"
                className="bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-6 py-4 rounded-xl inline-flex items-center gap-3"
              >
                <FaCheckCircle className="text-xl" />
                <span className="font-semibold">
                  Welcome aboard! Check your inbox for your first insight.
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-grow relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-[#F47C26] focus:bg-white dark:focus:bg-white/10 transition-all shadow-inner"
                    placeholder="Enter your business email"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe <FaPaperPlane className="text-sm" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-8 text-xs text-gray-500 dark:text-gray-500">
            No spam, ever. We only send high-value technical content.
            Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
