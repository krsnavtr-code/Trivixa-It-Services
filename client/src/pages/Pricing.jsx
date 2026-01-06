import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaGlobe,
  FaMobileAlt,
  FaPaintBrush,
  FaServer,
  FaRocket,
  FaShieldAlt,
  FaLaptopCode,
} from "react-icons/fa";

// --- Pricing Data Configuration ---
const pricingData = {
  web: {
    title: "Web Development",
    subtitle: "Scalable websites built with React, Node.js, PHP, and Laravel.",
    plans: [
      {
        id: "starter",
        name: "Starter Plan",
        tagline: "Basic Website Development",
        price: "₹15,000 - ₹20,000",
        isPopular: false,
        technologies: ["HTML5", "CSS3", "Bootstrap", "Basic PHP"],
        includes: [
          "Up to 5 Pages (Home, About, Services)",
          "Responsive Design (Mobile & Desktop)",
          "Basic UI Layout",
          "Contact Form & WhatsApp Chat",
          "Basic SEO Setup",
          "SSL-Ready Structure",
        ],
        excludes: [
          "Admin Panel / CMS",
          "Blog System",
          "Advanced Animations",
          "Payment Gateway",
          "Hosting & Domain",
        ],
      },
      {
        id: "business",
        name: "Business Plan",
        tagline: "Professional Website Development",
        price: "₹25,000 - ₹35,000",
        isPopular: true,
        badgeText: "Most Popular",
        technologies: ["WordPress", "Laravel", "MySQL", "jQuery"],
        includes: [
          "8 to 12 Pages",
          "Custom UI/UX Design",
          "Service Detail Pages",
          "Dynamic Portfolio / Projects",
          "Lead Capture Forms",
          "WhatsApp & Email Integration",
          "Basic Admin Panel",
          "On-page SEO Optimization",
        ],
        excludes: [
          "Multi-language Support",
          "Advanced E-commerce",
          "Hosting & Domain",
          "Paid Plugins",
        ],
      },
      {
        id: "premium",
        name: "Premium Plan",
        tagline: "Corporate Website Development",
        price: "₹45,000 - ₹70,000",
        isPopular: false,
        badgeText: "Recommended",
        technologies: ["React.js", "Node.js", "MongoDB", "Tailwind"],
        includes: [
          "15 to 20 Pages",
          "Advanced UI/UX with Animations",
          "Fully Responsive & Speed Optimized",
          "Full Admin Panel / CMS",
          "Blog & Content Management",
          "Case Studies & Testimonials",
          "Google Analytics Integration",
          "Security Optimization",
        ],
        excludes: [
          "Multi-vendor Marketplace",
          "Hosting & Domain",
          "Paid API Integrations",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise Plan",
        tagline: "Custom/SaaS Web Application",
        price: "₹80,000 - ₹1.5L+",
        isPopular: false,
        technologies: ["MERN Stack", "Next.js", "AWS", "Docker"],
        includes: [
          "Unlimited Pages",
          "Fully Custom UI/UX Design",
          "Advanced Dashboard & Role Access",
          "Blog, Portfolio, Case Studies",
          "Advanced Lead Management",
          "Custom Features (SaaS logic)",
          "Deployment & Launch Support",
          "Priority Technical Support",
        ],
        excludes: [
          "Hosting & Domain (Extra)",
          "Paid Third-party Services",
          "Ongoing Digital Marketing",
        ],
      },
    ],
  },
  app: {
    title: "App Development",
    subtitle: "Native and Hybrid mobile applications for Android and iOS.",
    plans: [
      {
        id: "hybrid_basic",
        name: "Hybrid Basic",
        tagline: "MVP / Simple App",
        price: "₹40,000 - ₹60,000",
        isPopular: false,
        technologies: ["Flutter", "Firebase"],
        includes: [
          "Android Only",
          "Basic UI Components",
          "User Authentication",
          "Push Notifications",
          "5-7 Screens",
        ],
        excludes: ["iOS Version", "Complex Backend", "Payment Gateway"],
      },
      {
        id: "hybrid_pro",
        name: "Hybrid Pro",
        tagline: "Business Application",
        price: "₹80,000 - ₹1.2L",
        isPopular: true,
        badgeText: "Best Value",
        technologies: ["React Native", "Node.js", "MongoDB"],
        includes: [
          "Android & iOS (Shared Code)",
          "Custom UI/UX",
          "API Integration",
          "Admin Panel",
          "Google Maps Integration",
          "10-15 Screens",
        ],
        excludes: ["Advanced AI Features", "Play Store Fees"],
      },
      {
        id: "native",
        name: "Native Scale",
        tagline: "High Performance App",
        price: "₹2L - ₹5L+",
        isPopular: false,
        technologies: ["Swift", "Kotlin", "AWS"],
        includes: [
          "Pure Native Performance",
          "Complex Animations",
          "Real-time Chat/Socket",
          "Payment Gateway",
          "Advanced Security",
          "Scalable Backend",
        ],
        excludes: ["Marketing", "Maintenance (AMC Extra)"],
      },
    ],
  },
};

const Pricing = () => {
  const [activeCategory, setActiveCategory] = useState("web");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans transition-colors duration-500 pb-20 relative overflow-hidden">
      {/* --- Ambient Background (Adaptive) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 dark:bg-[#F47C26]/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/20 dark:bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
            Transparent <span className="text-[#F47C26]">Pricing</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Choose the perfect plan for your business needs. No hidden fees,
            just value-driven solutions.
          </p>
        </div>

        {/* --- Tabs --- */}
        <div className="flex justify-center mb-16">
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1.5 rounded-2xl flex gap-2 shadow-sm backdrop-blur-md">
            <button
              onClick={() => setActiveCategory("web")}
              className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base flex items-center gap-2 transition-all ${
                activeCategory === "web"
                  ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <FaGlobe /> Web Development
            </button>
            <button
              onClick={() => setActiveCategory("app")}
              className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base flex items-center gap-2 transition-all ${
                activeCategory === "app"
                  ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <FaMobileAlt /> App Development
            </button>
          </div>
        </div>

        {/* --- Pricing Grid --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-1 md:grid-cols-2 ${
              activeCategory === "web" ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } gap-6`}
          >
            {pricingData[activeCategory].plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group ${
                  plan.isPopular
                    ? "bg-white dark:bg-white/10 border-2 border-[#F47C26] shadow-2xl shadow-[#F47C26]/10 transform scale-105 z-10"
                    : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl dark:shadow-none"
                }`}
              >
                {/* Badge */}
                {(plan.isPopular || plan.badgeText) && (
                  <div className="absolute top-0 left-0 right-0 bg-[#F47C26] text-white text-center text-xs font-bold py-1.5 uppercase tracking-wider">
                    {plan.badgeText || "Most Popular"}
                  </div>
                )}

                <div
                  className={`p-6 md:p-8 flex-1 flex flex-col ${
                    plan.isPopular ? "pt-10" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 h-8 font-medium">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                      {plan.price}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      One-time project cost
                    </p>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="mb-6">
                    <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-widest mb-2 flex items-center gap-1">
                      <FaLaptopCode /> Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {plan.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-gray-100 dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 text-[10px] text-gray-600 dark:text-gray-300 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features (Includes) */}
                  <div className="flex-1 mb-6">
                    <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-widest mb-3 flex items-center gap-2">
                      <FaCheck className="text-green-500" /> Includes
                    </p>
                    <ul className="space-y-3">
                      {plan.includes.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <FaCheck className="mt-1 text-green-500 shrink-0 text-xs" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excludes (Only if it exists) */}
                  {plan.excludes && plan.excludes.length > 0 && (
                    <div className="mb-8 opacity-70">
                      <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-widest mb-3 flex items-center gap-2">
                        <FaTimes className="text-red-500" /> Excludes
                      </p>
                      <ul className="space-y-2">
                        {plan.excludes.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500"
                          >
                            <FaTimes className="shrink-0 text-red-500 text-xs" />
                            <span className="leading-snug line-through decoration-red-500/30">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      to="/contact"
                      className={`block w-full py-3 rounded-xl text-center font-bold text-sm transition-all ${
                        plan.isPopular
                          ? "bg-[#F47C26] text-white hover:bg-[#d5671f] shadow-lg shadow-orange-500/25"
                          : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 border border-transparent dark:border-white/10"
                      }`}
                    >
                      {plan.price.includes("1.5L")
                        ? "Contact Us"
                        : "Get Started"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* --- Add-Ons Section --- */}
        <div className="mt-20 bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/10 rounded-2xl p-8 mb-20 shadow-xl dark:shadow-none">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
            Optional Add-On Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: <FaGlobe />, name: "Domain & Hosting" },
              { icon: <FaPaintBrush />, name: "Content Writing" },
              { icon: <FaRocket />, name: "Advanced SEO" },
              { icon: <FaGlobe />, name: "Multi-language" },
              { icon: <FaServer />, name: "Third-party APIs" },
              { icon: <FaShieldAlt />, name: "Annual AMC" },
            ].map((addon, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:shadow-md dark:hover:shadow-none transition-all cursor-default"
              >
                <div className="text-[#F47C26] text-xl">{addon.icon}</div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-300">
                  {addon.name}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">
                  (Extra Cost)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
