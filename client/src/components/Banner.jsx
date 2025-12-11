import React from "react";
import { FaArrowRight, FaCheckCircle, FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Banner = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingVariant = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#0a0f2d] overflow-hidden py-20 px-6">
      {/* --- Background Effects --- */}

      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Dynamic Glow Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] z-0"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F47C26]/20 rounded-full blur-[120px] z-0"
      />

      {/* --- Main Content --- */}
      <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Content */}
        <motion.div
          className="lg:w-1/2 space-y-8 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              🚀 Welcome to Trivixa
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.15]"
          >
            Convert Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] via-[#ff9e5e] to-[#F47C26]">
              Ideas
            </span>{" "}
            Into <br />
            Digital Reality
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Trivixa empowers you with modern web development, advanced IT
            solutions, and professional skill-based learning—so you grow
            smarter, faster, and better.
          </motion.p>

          {/* Highlights */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm font-medium text-gray-300"
          >
            {["Professional Courses", "IT Services", "Scalable Solutions"].map(
              (text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#F47C26]" /> {text}
                </div>
              )
            )}
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
          >
            <Link to="/courses" className="group">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all duration-300">
                Get Started
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link to="/services">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <FaPlayCircle className="text-gray-400" />
                Explore Services
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content: Modern 3D Floating Card */}
        <motion.div
          className="lg:w-1/2 relative w-full flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            variants={floatingVariant}
            animate="animate"
            className="relative z-10 p-4 lg:p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl w-full max-w-lg"
          >
            {/* Image Container with Glow */}
            <div className="relative rounded-2xl overflow-hidden shadow-inner border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2d] to-transparent opacity-40 z-10"></div>
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/full-stack-web-development-6103308-5042541.png"
                alt="Banner Illustration"
                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Badge 1 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -top-6 -right-6 bg-[#1a2d5c] border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                98%
              </div>
              <div className="text-left">
                <p className="text-white text-xs font-bold">Satisfaction</p>
                <p className="text-gray-400 text-[10px]">
                  Based on 5k+ reviews
                </p>
              </div>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-[#1a2d5c] border border-white/10 px-6 py-3 rounded-2xl shadow-xl"
            >
              <p className="text-white text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Top Rated Courses
              </p>
            </motion.div>
          </motion.div>

          {/* Decorative Elements Behind Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
