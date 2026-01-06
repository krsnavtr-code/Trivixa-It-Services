import React, { useRef, useState, useEffect } from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
  FaReact,
  FaNodeJs,
  FaAws,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";

// --- Carousel Configuration ---
const CAROUSEL_IMAGES = [
  {
    src: "http://trivixa.in/api/upload/file/trivixa-banner-software-development-21122025-1625.jpg",
    title: "Software Development",
    tag: "On Your Need",
  },
  {
    src: "http://trivixa.in/api/upload/file/trivixa-banner-cloud-data-solutions-21122025-1625.jpg",
    title: "Cloud & Data Solutions",
    tag: "AWS Ready",
  },
  {
    src: "http://trivixa.in/api/upload/file/trivixa-banner-cybersecurity-21122025-1625.jpg",
    title: "Cyber Security",
    tag: "Neural v1.0",
  },
];

const Banner = () => {
  // --- Carousel State & Logic ---
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // --- 3D Tilt Logic ---
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative pt-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Futuristic Background --- */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light rounded-2xl"></div>
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"
            style={{
              backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px),
                              linear-gradient(to bottom, #808080 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            }}
          />
        </div>

        {/* --- Main Content --- */}
        <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col-reverse lg:flex-row items-center gap-12 md:gap-16 lg:gap-24">
          {/* Left Content: Typography & CTA */}
          <motion.div
            className="lg:w-1/2 space-y-8 md:space-y-10 text-center lg:text-left pt-8 lg:pt-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex">
              <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#F47C26_0%,#393BB2_50%,#F47C26_100%)]" />
                <span className="inline-flex h-full w-full cursor-default items-center justify-center rounded-full bg-white dark:bg-[#0a0f2d] px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 backdrop-blur-3xl">
                  🚀 Innovation Loaded
                </span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight"
            >
              Forging the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] via-purple-500 to-blue-600 animate-gradient-x">
                Future of Web
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Trivixa architects high-performance digital ecosystems. We blend
              <span className="font-semibold text-gray-900 dark:text-white">
                {" "}
                artistic vision{" "}
              </span>
              with
              <span className="font-semibold text-gray-900 dark:text-white">
                {" "}
                engineering precision{" "}
              </span>
              to scale your business.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {["Next-Gen Stacks", "AI Integration", "Cloud Native"].map(
                (text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F47C26] shadow-[0_0_10px_#F47C26]" />
                    {text}
                  </div>
                )
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
            >
              <Link to="/courses" className="group relative w-full sm:w-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F47C26] to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button className="relative w-full px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                  Start Building
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link to="/services" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-transparent border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                    <FaPlay className="text-xs ml-0.5" />
                  </span>
                  Our Services
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content: Holographic 3D Carousel Card */}
          <motion.div
            className="lg:w-1/2 w-full flex justify-center lg:justify-end perspective-1000"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <motion.div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-[320px] sm:max-w-md md:max-w-lg aspect-[4/5] sm:aspect-square md:aspect-[4/3] rounded-3xl"
            >
              {/* The Glass Card Body */}
              <div className="absolute inset-0 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Internal Glow Gradient */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/10 dark:via-white/5 to-transparent rotate-45 pointer-events-none" />

                {/* Main Image Carousel */}
                <div className="absolute inset-0 p-2">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                    {/* Permanent Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <img
                          src={CAROUSEL_IMAGES[currentIndex].src}
                          alt="Carousel Slide"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Overlay Content */}
                    <div className="absolute bottom-6 left-6 z-20 w-full pr-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded bg-[#F47C26] text-white text-[10px] font-bold uppercase">
                          Live
                        </span>
                        <motion.span
                          key={`tag-${currentIndex}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-white/80 text-xs font-mono"
                        >
                          {CAROUSEL_IMAGES[currentIndex].tag}
                        </motion.span>
                      </div>

                      <motion.h3
                        key={`title-${currentIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl sm:text-2xl font-bold text-white leading-tight mb-4"
                      >
                        {CAROUSEL_IMAGES[currentIndex].title
                          .split(" ")
                          .reduce((acc, word, i) => {
                            if (i % 2 === 0) acc.push([word]);
                            else acc[acc.length - 1].push(word);
                            return acc;
                          }, [])
                          .map((pair, i) => (
                            <span key={i} className="block">
                              {pair.join(" ")}
                            </span>
                          ))}
                      </motion.h3>

                      {/* Dots Navigation */}
                      <div className="flex gap-2 pointer-events-auto">
                        {CAROUSEL_IMAGES.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDotClick(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentIndex
                                ? "bg-[#F47C26] w-6"
                                : "bg-white/30 w-1.5 hover:bg-white/60"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements (Parallax) */}
              <motion.div
                style={{ translateZ: 60 }}
                className="absolute -top-6 -right-6 p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#1a1f3c] border border-gray-100 dark:border-white/10 shadow-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg sm:text-xl">
                  <FaReact />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    Library
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    React Native
                  </p>
                </div>
              </motion.div>

              <motion.div
                style={{ translateZ: 80 }}
                className="absolute -bottom-18 -left-24 bg-white dark:bg-[#1a1f3c] border border-gray-100 dark:border-white/10 p-4 sm:p-5 rounded-2xl shadow-2xl max-w-[160px] sm:max-w-[200px]"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Uptime
                  </span>
                  <FaAws className="text-[#F47C26] text-lg" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  99.9%
                </div>
                <div className="w-full bg-gray-200 dark:bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[98%]" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
