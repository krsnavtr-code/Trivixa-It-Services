import React from "react";
import {
  FaHandshake,
  FaDraftingCompass,
  FaCode,
  FaBug,
  FaRocket,
  FaHeadset,
} from "react-icons/fa";
import { motion } from "framer-motion";

const processSteps = [
  {
    id: "01",
    icon: <FaHandshake />,
    title: "Discovery & Strategy",
    desc: "We dive deep into your business goals, target audience, and requirements to blueprint a custom digital strategy.",
  },
  {
    id: "02",
    icon: <FaDraftingCompass />,
    title: "UI/UX Design",
    desc: "Our designers create wireframes and high-fidelity prototypes to ensure an intuitive and engaging user experience.",
  },
  {
    id: "03",
    icon: <FaCode />,
    title: "Agile Development",
    desc: "We write clean, scalable code using modern tech stacks, keeping you updated with regular sprint deliverables.",
  },
  {
    id: "04",
    icon: <FaBug />,
    title: "QA & Testing",
    desc: "Rigorous testing across devices and scenarios to ensure your product is bug-free, secure, and performance-optimized.",
  },
  {
    id: "05",
    icon: <FaRocket />,
    title: "Deployment & Launch",
    desc: "We handle the server setup, CI/CD pipelines, and go-live process to ensure a smooth, zero-downtime launch.",
  },
  {
    id: "06",
    icon: <FaHeadset />,
    title: "Support & Scaling",
    desc: "Our partnership continues post-launch with 24/7 maintenance, feature updates, and scaling strategies.",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const OurProcess = () => {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-[#F47C26]/10 border border-[#F47C26]/20 text-[#F47C26] text-xs font-bold uppercase tracking-wider"
          >
            How We Work
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            From Concept to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Code
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            A transparent, agile workflow designed to deliver high-impact
            digital solutions on time and within budget.
          </motion.p>

          <div className="mt-8 flex justify-center">
            [Image of agile software development lifecycle flowchart]
          </div>
        </div>

        {/* Process Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:bg-gray-50 dark:hover:bg-white/[0.08] dark:hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Background Number */}
              <div className="absolute top-4 right-6 text-6xl font-black text-gray-100 dark:text-white/5 group-hover:text-orange-500/10 transition-colors duration-300 pointer-events-none select-none">
                {step.id}
              </div>

              {/* Icon */}
              <div className="relative w-14 h-14 mb-6 rounded-xl bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="text-2xl text-blue-600 dark:text-blue-300 group-hover:text-[#F47C26] transition-colors duration-300">
                  {step.icon}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#F47C26] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {step.desc}
              </p>

              {/* Bottom Line Indicator */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#F47C26] transition-all duration-500 group-hover:w-full rounded-b-2xl"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurProcess;
