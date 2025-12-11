import React from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRocket,
  FaShieldAlt,
  FaCode,
  FaHeadset,
  FaClock,
} from "react-icons/fa";

// Data tailored for an IT Solutions Agency
const comparisonData = [
  {
    feature: "Custom Scalable Architecture",
    icon: <FaRocket />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "Enterprise-Grade Security",
    icon: <FaShieldAlt />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "Latest Tech Stack (React/Next/AI)",
    icon: <FaCode />,
    trivixa: true,
    freelancers: true, // Some freelancers use new tech
    templates: false,
  },
  {
    feature: "24/7 Post-Launch Support",
    icon: <FaHeadset />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "On-Time Delivery Guarantee",
    icon: <FaClock />,
    trivixa: true,
    freelancers: false,
    templates: true, // Templates are instant
  },
  {
    feature: "Dedicated Project Manager",
    icon: <FaCheckCircle />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
  {
    feature: "SEO & Performance Optimization",
    icon: <FaCheckCircle />,
    trivixa: true,
    freelancers: false,
    templates: false,
  },
];

const WhyChooseTrivixa = () => {
  return (
    <section className="relative py-24 px-6 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#F47C26] text-xs font-bold uppercase tracking-wider"
          >
            Why Choose Us
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Not Just Another{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              IT Agency
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            See how Trivixa stacks up against freelancers and template-based
            solutions. We build assets, not liabilities.
          </motion.p>
        </div>

        {/* --- Desktop Grid View --- */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl dark:shadow-none transition-colors duration-300">
            {/* Table Header */}
            <div className="col-span-1 p-6 border-b border-r border-gray-100 dark:border-white/10 flex items-center bg-gray-50 dark:bg-white/5">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Features
              </span>
            </div>
            {/* Trivixa Header */}
            <div className="col-span-1 p-6 border-b border-gray-100 dark:border-white/10 flex flex-col items-center justify-center bg-orange-50 dark:bg-[#F47C26]/10 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#F47C26]"></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Trivixa
              </span>
              <span className="text-xs text-[#F47C26] uppercase tracking-wide mt-1 font-bold">
                Best Choice
              </span>
            </div>
            {/* Competitor Headers */}
            <div className="col-span-1 p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-center bg-white dark:bg-transparent">
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                Freelancers
              </span>
            </div>
            <div className="col-span-1 p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-center bg-white dark:bg-transparent">
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                DIY / Templates
              </span>
            </div>

            {/* Table Body */}
            {comparisonData.map((item, index) => (
              <React.Fragment key={index}>
                {/* Feature Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="col-span-1 p-6 border-b border-r border-gray-100 dark:border-white/10 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent"
                >
                  <span className="text-[#F47C26] text-xl">{item.icon}</span>
                  <span className="font-medium">{item.feature}</span>
                </motion.div>

                {/* Trivixa Column */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  className="col-span-1 p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-center bg-orange-50/50 dark:bg-[#F47C26]/5"
                >
                  <StatusIcon status={item.trivixa} type="success" />
                </motion.div>

                {/* Freelancers Column */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className="col-span-1 p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-center bg-white dark:bg-transparent"
                >
                  <StatusIcon status={item.freelancers} type="neutral" />
                </motion.div>

                {/* Templates Column */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                  className="col-span-1 p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-center bg-white dark:bg-transparent"
                >
                  <StatusIcon status={item.templates} type="danger" />
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* --- Mobile Card View --- */}
        <div className="md:hidden space-y-6">
          {comparisonData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-white/5 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-lg dark:shadow-none"
            >
              {/* Feature Header */}
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                <span className="text-[#F47C26] text-2xl">{item.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.feature}
                </h3>
              </div>

              {/* Comparison Rows */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 dark:bg-[#F47C26]/10 border border-orange-100 dark:border-[#F47C26]/20">
                  <span className="text-gray-900 dark:text-white font-semibold">
                    Trivixa
                  </span>
                  <StatusIcon status={item.trivixa} type="success" />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <span className="text-gray-600 dark:text-gray-400">
                    Freelancers
                  </span>
                  <StatusIcon status={item.freelancers} type="neutral" />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <span className="text-gray-600 dark:text-gray-400">
                    Templates
                  </span>
                  <StatusIcon status={item.templates} type="danger" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper Component for Icons
const StatusIcon = ({ status, type }) => {
  if (status) {
    return (
      <div className="relative flex items-center justify-center w-8 h-8">
        <div
          className={`absolute inset-0 rounded-full blur-sm opacity-50 ${
            type === "success" ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
        <FaCheckCircle
          className={`relative z-10 text-2xl ${
            type === "success"
              ? "text-green-500 dark:text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
              : "text-gray-400 dark:text-gray-500"
          }`}
        />
      </div>
    );
  }
  return (
    <FaTimesCircle className="text-xl text-gray-300 dark:text-gray-600/50" />
  );
};

export default WhyChooseTrivixa;
