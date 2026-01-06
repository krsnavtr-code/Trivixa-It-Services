import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaShoppingCart,
  FaMobileAlt,
  FaPaintBrush,
  FaServer,
  FaCogs,
  FaCheckCircle,
} from "react-icons/fa";

// --- Static Data ---
const services = [
  {
    id: 1,
    title: "Custom Web Development",
    icon: <FaCode />,
    description:
      "Tailor-made websites built from scratch using the latest technologies like React, Node.js, and Laravel. We create scalable, high-performance solutions specific to your business logic.",
    features: [
      "Single Page Applications (SPA)",
      "SaaS Product Development",
      "Enterprise Web Portals",
      "API Development & Integration",
    ],
    bestFor: "Startups & Enterprises needing unique functionality.",
  },
  {
    id: 2,
    title: "E-Commerce Solutions",
    icon: <FaShoppingCart />,
    description:
      "Robust online stores designed to convert. We build secure, user-friendly shopping experiences using platforms like Shopify, WooCommerce, or custom MERN stack solutions.",
    features: [
      "Custom Shopping Carts",
      "Payment Gateway Integration",
      "Inventory Management Systems",
      "Multi-vendor Marketplaces",
    ],
    bestFor: "Retailers looking to sell products online globally.",
  },
  {
    id: 3,
    title: "UI/UX Design & Prototyping",
    icon: <FaPaintBrush />,
    description:
      "We design interfaces that users love. Our process starts with wireframing and prototyping to ensure the user journey is intuitive, accessible, and visually stunning.",
    features: [
      "User Research & Personas",
      "Wireframing & Prototyping",
      "Mobile-First Design",
      "Interactive Mockups",
    ],
    bestFor: "Businesses wanting to improve user engagement and retention.",
  },
  {
    id: 4,
    title: "CMS Development",
    icon: <FaServer />,
    description:
      "Empower your team to manage content easily. We specialize in WordPress, Strapi, and custom CMS solutions that give you full control over your digital content without coding.",
    features: [
      "Custom WordPress Themes",
      "Headless CMS Implementation",
      "Plugin Development",
      "Content Migration",
    ],
    bestFor:
      "Blogs, News Portals, and Corporate sites needing frequent updates.",
  },
  {
    id: 5,
    title: "Progressive Web Apps (PWA)",
    icon: <FaMobileAlt />,
    description:
      "The best of web and mobile combined. Our PWAs offer offline capabilities, push notifications, and app-like experiences directly in the browser.",
    features: [
      "Offline Functionality",
      "Fast Loading Speed",
      "App-like Interface",
      "Push Notifications",
    ],
    bestFor: "Businesses wanting mobile reach without the cost of native apps.",
  },
  {
    id: 6,
    title: "Maintenance & Support",
    icon: <FaCogs />,
    description:
      "We don't just build and leave. Our maintenance packages ensure your website stays secure, fast, and up-to-date with the latest web standards.",
    features: [
      "Security Patches & Updates",
      "Speed Optimization",
      "Regular Backups",
      "24/7 Technical Support",
    ],
    bestFor: "Any business requiring long-term stability and security.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    desc: "We analyze your requirements and market goals.",
  },
  {
    step: "02",
    title: "Design",
    desc: "We create visual prototypes and architectural blueprints.",
  },
  {
    step: "03",
    title: "Develop",
    desc: "We code using clean, scalable, and modern standards.",
  },
  {
    step: "04",
    title: "Launch",
    desc: "We deploy, test, and optimize for the live environment.",
  },
];

const WebServices = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans relative overflow-hidden selection:bg-[#F47C26] selection:text-white transition-colors duration-500">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#F47C26]/5 rounded-full blur-[150px]"></div>
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
              Expert Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              Web Development <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 dark:from-white dark:to-gray-500">
                Services
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              From simple landing pages to complex enterprise platforms, Trivixa
              delivers high-performance web solutions tailored to your unique
              business needs.
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
              Our Development <span className="text-[#F47C26]">Process</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A streamlined workflow designed to bring your vision to life
              efficiently and effectively.
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
              Ready to start your project?
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Let's discuss your requirements and find the perfect web solution
              for your business growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-[#F47C26] rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:-translate-y-1"
              >
                Get a Quote
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 bg-black/20 border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-black/30 transition-all backdrop-blur-sm hover:-translate-y-1"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebServices;
