import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaServer,
  FaMobileAlt,
  FaRocket,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

// --- Data ---
const stats = [
  { id: 1, label: "Years Experience", value: "5+" },
  { id: 2, label: "Projects Completed", value: "40+" },
  { id: 3, label: "Happy Clients", value: "35+" },
  { id: 4, label: "Coffee Consumed", value: "∞" },
];

const services = [
  {
    id: 1,
    icon: <FaCode />,
    title: "Frontend Development",
    desc: "Crafting responsive, pixel-perfect user interfaces using React, Tailwind, and modern CSS frameworks.",
  },
  {
    id: 2,
    icon: <FaServer />,
    title: "Backend Architecture",
    desc: "Building robust, scalable APIs and database schemas with Node.js, Express, and PostgreSQL/MongoDB.",
  },
  {
    id: 3,
    icon: <FaMobileAlt />,
    title: "Mobile Solutions",
    desc: "Developing cross-platform mobile applications that provide native-like experiences.",
  },
  {
    id: 4,
    icon: <FaRocket />,
    title: "Performance Optimization",
    desc: "Auditing and improving website speed, SEO, and accessibility for maximum reach.",
  },
];

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // --- Theme Colors ---
  const bgClass = isDark ? "bg-[#020e0a]" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";

  // Card Styles
  const cardBg = isDark
    ? "bg-[#051a12]/50 border-[#074F3E]/30"
    : "bg-white border-gray-200 shadow-xl";

  const accentColor = "#34d399"; // Mint
  const brandColor = "#074F3E"; // Deep Emerald

  return (
    <div
      className={`min-h-screen pt-24 pb-20 overflow-hidden relative transition-colors duration-500 ${bgClass}`}
    >
      {/* --- Background Ambience --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-[#074F3E]/20" : "bg-[#074F3E]/5"
          }`}
        ></div>
        <div
          className={`absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-[#34d399]/10" : "bg-[#34d399]/5"
          }`}
        ></div>
        {isDark && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Hero Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 ${
                isDark
                  ? "border-[#34d399]/30 bg-[#074F3E]/20 text-[#34d399]"
                  : "border-[#074F3E]/20 bg-[#074F3E]/5 text-[#074F3E]"
              }`}
            >
              About Me
            </div>

            <h1
              className={`text-4xl md:text-6xl font-black leading-tight mb-6 ${textMain}`}
            >
              Driven by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#074F3E] via-[#10b981] to-[#34d399]">
                Innovation & Logic.
              </span>
            </h1>

            <p className={`text-lg mb-6 leading-relaxed ${textSub}`}>
              I'm a passionate Full Stack Developer based in India, dedicated to
              building software that matters. My journey began with a curiosity
              for how things work under the hood, and it has evolved into a
              career of architecting complex digital ecosystems.
            </p>
            <p className={`text-lg mb-8 leading-relaxed ${textSub}`}>
              Whether it's a high-performance e-commerce platform or an
              intricate internal tool, I bring a blend of creative design
              thinking and rigid engineering standards to every project.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {stats.map((stat) => (
                <div key={stat.id} className="border-l-2 border-[#074F3E] pl-4">
                  <h4
                    className={`text-3xl font-bold mb-1 ${
                      isDark ? "text-[#34d399]" : "text-[#074F3E]"
                    }`}
                  >
                    {stat.value}
                  </h4>
                  <p
                    className={`text-sm font-medium uppercase tracking-wide ${textSub}`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image / Abstract Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div
              className={`aspect-[4/5] rounded-[2rem] overflow-hidden relative border ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}
            >
              {/* Replace with your actual photo */}
              {/* <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop"
                alt="Portrait"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              /> */}

              {/* Overlay Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isDark
                    ? "from-[#020e0a] via-transparent to-transparent"
                    : "from-white via-transparent to-transparent"
                } opacity-60`}
              ></div>
            </div>

            {/* Decorative Floating Element */}
            <div
              className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-2xl flex items-center justify-center backdrop-blur-xl border shadow-2xl ${
                isDark
                  ? "bg-[#074F3E]/80 border-[#34d399]/30"
                  : "bg-white border-gray-100"
              }`}
            >
              <FaCode className="text-5xl text-white" />
            </div>
          </motion.div>
        </div>

        {/* --- What I Do Section --- */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${textMain}`}>
              What I Bring to the Table
            </h2>
            <p className={`max-w-2xl mx-auto ${textSub}`}>
              My expertise spans the entire software development lifecycle,
              ensuring your product is built to last.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={service.id}
                className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${cardBg} hover:border-[#34d399]/50`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-colors ${
                    isDark
                      ? "bg-[#074F3E]/30 text-[#34d399] group-hover:bg-[#34d399] group-hover:text-[#020e0a]"
                      : "bg-[#074F3E]/10 text-[#074F3E] group-hover:bg-[#074F3E] group-hover:text-white"
                  }`}
                >
                  {service.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${textMain}`}>
                  {service.title}
                </h3>
                <p className={`text-sm leading-relaxed ${textSub}`}>
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Philosophy / CTA --- */}
        <div
          className={`rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden text-center border ${
            isDark
              ? "bg-[#051a12] border-[#074F3E]/30"
              : "bg-white border-gray-200 shadow-2xl"
          }`}
        >
          {/* Background Patterns */}
          <div
            className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#074F3E] to-transparent opacity-20 blur-3xl rounded-full`}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#34d399] to-transparent opacity-10 blur-3xl rounded-full`}
          ></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className={`text-3xl md:text-5xl font-black mb-8 ${textMain}`}>
              "Code is poetry written for machines,{" "}
              <br className="hidden md:block" /> but designed for humans."
            </h2>
            <Link
              to="/contact"
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 shadow-lg ${
                isDark
                  ? "bg-[#34d399] text-[#020e0a] hover:bg-white"
                  : "bg-[#074F3E] text-white hover:bg-[#0a6650]"
              }`}
            >
              Let's Collaborate <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
