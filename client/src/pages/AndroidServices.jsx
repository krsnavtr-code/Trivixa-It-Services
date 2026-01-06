import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaAndroid,
  FaGooglePlay,
  FaMobileAlt,
  FaTabletAlt,
  FaCogs,
  FaRocket,
  FaCode,
  FaCheckCircle,
  FaLayerGroup,
} from "react-icons/fa";

// --- Static Data ---
const services = [
  {
    id: 1,
    title: "Native Android Development",
    icon: <FaAndroid />,
    description:
      "We build powerful, high-performance native apps using Kotlin and Java. Our apps are optimized for the Android ecosystem, ensuring seamless integration with device hardware and superior performance.",
    features: [
      "Kotlin-First Approach",
      "Material Design 3 Implementation",
      "Native Hardware Integration",
      "Advanced Security Features",
    ],
    bestFor: "Apps requiring maximum performance and hardware access.",
  },
  {
    id: 2,
    title: "Cross-Platform (Flutter/React Native)",
    icon: <FaLayerGroup />,
    description:
      "Reach more users faster. We develop hybrid apps that look and feel native on Android while sharing a codebase with iOS, saving you time and development costs.",
    features: [
      "Single Codebase (Android & iOS)",
      "Native-Like Performance",
      "Faster Time-to-Market",
      "Cost-Effective Development",
    ],
    bestFor: "Startups & MVPs needing to launch on both platforms.",
  },
  {
    id: 3,
    title: "Android UI/UX Design",
    icon: <FaMobileAlt />,
    description:
      "We adhere to Google's Material Design guidelines to create intuitive, accessible, and visually stunning interfaces that provide an engaging user experience across all screen sizes.",
    features: [
      "User Journey Mapping",
      "Interactive Prototyping",
      "Adaptive Layouts (Foldables/Tablets)",
      "Accessibility Compliance",
    ],
    bestFor: "Enhancing user retention and app usability.",
  },
  {
    id: 4,
    title: "Enterprise Android Solutions",
    icon: <FaTabletAlt />,
    description:
      "Secure and scalable mobile solutions for large organizations. We build apps that integrate with existing ERPs, CRMs, and secure corporate databases.",
    features: [
      "End-to-End Encryption",
      "Offline Data Synchronization",
      "Legacy System Integration",
      "Role-Based Access Control",
    ],
    bestFor: "Large scale businesses digitizing their workflow.",
  },
  {
    id: 5,
    title: "App Store Deployment & ASO",
    icon: <FaGooglePlay />,
    description:
      "We handle the entire submission process to the Google Play Store and optimize your listing (ASO) to ensure your app ranks high and gets discovered by the right audience.",
    features: [
      "Policy Compliance Check",
      "Keyword Optimization",
      "Visual Asset Creation",
      "Review Management Strategy",
    ],
    bestFor: "Maximizing downloads and visibility.",
  },
  {
    id: 6,
    title: "Maintenance & Upgrades",
    icon: <FaCogs />,
    description:
      "The mobile landscape changes fast. We ensure your app stays compatible with the latest Android OS versions, fix bugs, and implement new features continuously.",
    features: [
      "OS Version Updates (Android 14+)",
      "Performance Monitoring",
      "Crash Analytics & Fixes",
      "Feature Enhancements",
    ],
    bestFor: "Long-term app stability and user satisfaction.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Strategy",
    desc: "Defining the app's purpose, target audience, and monetization model.",
  },
  {
    step: "02",
    title: "UX/UI",
    desc: "Crafting wireframes and high-fidelity mockups using Material Design.",
  },
  {
    step: "03",
    title: "Coding",
    desc: "Developing the app using clean, efficient Kotlin or Flutter code.",
  },
  {
    step: "04",
    title: "Testing",
    desc: "Rigorous testing on various devices (QA, Performance, Security).",
  },
];

const AndroidServices = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans relative overflow-hidden selection:bg-[#F47C26] selection:text-white transition-colors duration-500">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F47C26]/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* --- Hero Section --- */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#F47C26] font-bold tracking-widest uppercase text-sm mb-4 block">
              Mobile Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              Android App <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 dark:from-green-400 dark:to-green-600">
                Development
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Transform your business with high-performance, scalable, and
              user-centric Android applications tailored for the global mobile
              market.
            </p>
          </motion.div>
        </div>

        {/* --- Services Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:border-[#F47C26]/50 dark:hover:border-[#F47C26]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-2xl text-[#F47C26] mb-6 group-hover:bg-[#F47C26] group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-grow">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-300"
                  >
                    <FaCheckCircle
                      className="mt-1 text-green-500 shrink-0"
                      size={12}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Best For Tag */}
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-2">
                  Best For:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200 italic font-medium">
                  {service.bestFor}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Process Section --- */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              App Development <span className="text-[#F47C26]">Lifecycle</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              From concept to the Play Store, we follow an agile methodology to
              deliver perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative p-6 bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-none hover:shadow-lg transition-shadow"
              >
                <div className="text-6xl font-black text-gray-100 dark:text-white/5 absolute top-4 right-4 select-none">
                  {step.step}
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-[#F47C26]/10 rounded-full flex items-center justify-center text-[#F47C26] font-bold mb-4 border border-[#F47C26]/20">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CTA Section --- */}
        <div className="relative bg-gradient-to-r from-[#F47C26] to-[#d5671f] rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl shadow-orange-500/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-multiply"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-sm">
              Have an App Idea?
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Let's turn your concept into a high-performing Android
              application. Schedule a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-[#F47C26] rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:-translate-y-1"
              >
                Start Your Project
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-black/20 border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-black/30 transition-all backdrop-blur-sm hover:-translate-y-1"
              >
                View App Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AndroidServices;
