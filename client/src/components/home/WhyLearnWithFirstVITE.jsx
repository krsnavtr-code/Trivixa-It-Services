import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaShieldAlt,
  FaCode,
  FaHeadset,
  FaClock,
  FaUserTie,
  FaChartLine,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

// Data tailored for an IT Solutions Agency
const comparisonData = [
  {
    feature: "Scalable Architecture",
    icon: <FaRocket />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "Enterprise Security Protocols",
    icon: <FaShieldAlt />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "Next-Gen Tech Stack (AI/Web3)",
    icon: <FaCode />,
    trivixa: true,
    freelancers: true,
    templates: false,
  },
  {
    feature: "24/7 Mission Critical Support",
    icon: <FaHeadset />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "Rapid Deployment (On-Time)",
    icon: <FaClock />,
    trivixa: true,
    freelancers: false,
    templates: true,
  },
  {
    feature: "Dedicated Squad Lead",
    icon: <FaUserTie />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "Growth Engine Optimization",
    icon: <FaChartLine />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
];

// Animation variants for rows
const rowVariants = {
  hidden: { opacity: 0, y: 20, scaleX: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scaleX: 1,
    transition: { delay: i * 0.1, duration: 0.5, type: "spring" },
  }),
};

const WhyChooseTrivixa = () => {
  return (
    <section className="relative py-28 px-6 bg-gray-50 dark:bg-[#05081a] overflow-hidden transition-colors duration-500">
      {/* --- Sci-Fi Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-5 dark:opacity-10 animate-pulse-slow mix-blend-multiply dark:mix-blend-screen"></div>

        {/* Glowing Orbs (Adjusted for Light Mode visibility) */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-orange-400/10 dark:bg-[#F47C26]/20 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen"></div>

        {/* Digital Grid Floor */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-200 via-transparent to-transparent dark:from-[#0B2545] dark:to-transparent opacity-50 grid-lines-perspective"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Tech Readout Style */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 backdrop-blur-md"
          >
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-ping"></div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-300 tracking-[0.3em] uppercase">
              System Analysis // Comparative Data
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 dark:from-white dark:to-blue-300">
              Initialize
            </span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-orange-500 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(244,124,38,0.5)]">
              Superiority
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-blue-200/70 font-mono">
            &gt; Executing comparison protocol. Why Trivixa's engineering
            framework outperforms legacy solutions.
          </p>
        </div>

        {/* --- Futuristic Comparison Engine (Desktop) --- */}
        <div className="hidden md:block relative">
          {/* Headers Row */}
          <div className="grid grid-cols-12 gap-4 mb-8 text-center uppercase tracking-widest text-sm font-bold">
            <div className="col-span-4 text-left pl-8 text-gray-400 dark:text-blue-300/50">
              Core Module Parameters
            </div>
            <div className="col-span-3 text-gray-400 dark:text-blue-300/50">
              Freelance Units
            </div>
            {/* Trivixa Header */}
            <div className="col-span-2 relative">
              <div className="absolute inset-0 bg-[#F47C26] blur-[20px] opacity-10 dark:opacity-30"></div>
              <div className="relative z-10 text-[#F47C26] drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(244,124,38,0.8)]">
                Trivixa Core
              </div>
            </div>
            <div className="col-span-3 text-gray-400 dark:text-blue-300/50">
              Generic Templates
            </div>
          </div>

          {/* Data Rows */}
          <div className="space-y-4">
            {comparisonData.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                // Glassmorphic data slate
                className="grid grid-cols-12 gap-4 items-center bg-white dark:bg-white/[0.02] backdrop-blur-sm border border-gray-200 dark:border-white/5 rounded-xl p-4 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all duration-300 group relative overflow-hidden shadow-sm"
              >
                {/* Scanline effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 dark:via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>

                {/* Feature Label */}
                <div className="col-span-4 flex items-center gap-4 pl-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl shrink-0 shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:text-[#F47C26] group-hover:border-[#F47C26]/30 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-bold text-gray-800 dark:text-white text-sm tracking-wide uppercase font-mono">
                    {item.feature}
                  </span>
                </div>

                {/* Freelancers Data */}
                <div className="col-span-3 flex justify-center">
                  <StatusReactor status={item.freelancers} type="neutral" />
                </div>

                {/* Trivixa Data - The centerpiece */}
                <div className="col-span-2 relative flex justify-center py-2">
                  {/* Glowing backdrop for the Trivixa column */}
                  <div className="absolute inset-y-0 w-full bg-[#F47C26]/5 dark:bg-[#F47C26]/10 blur-md border-x border-[#F47C26]/10 dark:border-[#F47C26]/20 -z-10 rounded-lg"></div>
                  <StatusReactor
                    status={item.trivixa}
                    type="success"
                    isHero={true}
                  />
                </div>

                {/* Templates Data */}
                <div className="col-span-3 flex justify-center">
                  <StatusReactor status={item.templates} type="danger" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Mobile View (Futuristic Data Pads) --- */}
        <div className="md:hidden space-y-6">
          {comparisonData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#0a0f2d] dark:bg-opacity-80 backdrop-blur-xl border-t border-l border-blue-500/30 border-b border-r border-purple-500/30 rounded-2xl p-6 relative overflow-hidden shadow-lg dark:shadow-[0_0_20px_rgba(11,37,69,0.5)]"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#F47C26]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>

              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-blue-500/20">
                <div className="text-[#F47C26] text-2xl drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(244,124,38,0.8)]">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono text-sm">
                  {item.feature}
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Trivixa Row Mobile */}
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-[#F47C26]/10 to-transparent border border-[#F47C26]/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#F47C26]/5 animate-pulse"></div>
                  <span className="font-bold text-gray-900 dark:text-white relative z-10 uppercase tracking-widest">
                    Trivixa Core
                  </span>
                  <div className="relative z-10">
                    <StatusReactor
                      status={item.trivixa}
                      type="success"
                      isHero={true}
                      mobile
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-blue-200/70">
                  <span>Freelance Units</span>
                  <StatusReactor
                    status={item.freelancers}
                    type="neutral"
                    mobile
                  />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-blue-200/70">
                  <span>Basic Templates</span>
                  <StatusReactor status={item.templates} type="danger" mobile />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Glowing Reactor Component (Replaces standard icons) ---
const StatusReactor = ({ status, type, isHero = false, mobile = false }) => {
  const sizeClasses = mobile ? "w-6 h-6" : "w-8 h-8";

  if (status) {
    // Success State
    const colorClass =
      isHero || type === "success" ? "bg-[#F47C26]" : "bg-blue-500";
    const shadowClass =
      isHero || type === "success"
        ? "shadow-md dark:shadow-[0_0_20px_rgba(244,124,38,0.8)]"
        : "shadow-md dark:shadow-[0_0_15px_rgba(59,130,246,0.6)]";
    const ringClass =
      isHero || type === "success" ? "border-[#F47C26]" : "border-blue-400";

    return (
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring (Dark mode only) */}
        <div
          className={`hidden dark:block absolute inset-0 rounded-full border-2 ${ringClass} opacity-50 animate-ping`}
        ></div>
        {/* Inner glowing core */}
        <div
          className={`${sizeClasses} rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-bold z-10 ${shadowClass}`}
        >
          {isHero ? (
            <FaCheck className="drop-shadow-md" />
          ) : mobile ? (
            <FaCheck />
          ) : (
            ""
          )}
        </div>
        {/* Halo effect (Dark mode only) */}
        {isHero && (
          <div className="hidden dark:block absolute inset-0 bg-[#F47C26] blur-md opacity-60"></div>
        )}
      </div>
    );
  }

  // Failure/Neutral State (Dimmed/Offline reactor)
  return (
    <div
      className={`${sizeClasses} rounded-full bg-gray-200 dark:bg-[#0B2545] border border-gray-300 dark:border-red-900/50 flex items-center justify-center text-gray-400 dark:text-red-700/50 opacity-70`}
    >
      <FaTimes />
    </div>
  );
};

export default WhyChooseTrivixa;
