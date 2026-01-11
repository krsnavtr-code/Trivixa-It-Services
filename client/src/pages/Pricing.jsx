import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaSpinner,
  FaArrowRight,
  FaQuestionCircle,
} from "react-icons/fa";
import ScheduleMeetingModal from "../components/common/ScheduleMeetingModal";
import { getPricing } from "../api/pricingApi";

const Pricing = () => {
  const [pricingData, setPricingData] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setIsLoading(true);
        const data = await getPricing();
        setPricingData(data);
        const categories = Object.keys(data);
        if (categories.length > 0 && !activeCategory) {
          setActiveCategory(categories[0]);
        }
      } catch (err) {
        console.error("Failed to fetch pricing data:", err);
        setError("Failed to load pricing data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPricingData();
  }, []);

  const currentCategory =
    activeCategory && pricingData[activeCategory]
      ? pricingData[activeCategory]
      : { title: "Loading...", subtitle: "Loading...", plans: [] };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f2d]">
        <FaSpinner className="animate-spin text-4xl text-[#F47C26]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#F47C26] text-white rounded-lg hover:bg-[#d5671f]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans transition-colors duration-500 pb-20 relative overflow-hidden">
      {/* --- Dynamic Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#F47C26]/10 dark:bg-[#F47C26]/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#F47C26] font-bold tracking-widest uppercase text-sm mb-3 block">
              Plans for every stage
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Transparent{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-orange-600">
                Pricing
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the perfect plan for your business needs. No hidden fees,
              just value-driven solutions.
            </p>
          </motion.div>
        </div>

        {/* --- Advanced Tab Switcher --- */}
        {Object.keys(pricingData).length > 0 && (
          <div className="flex justify-center mb-16">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 shadow-sm backdrop-blur-md relative">
              {Object.entries(pricingData).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`relative px-6 py-3 rounded-xl font-bold text-sm md:text-base flex items-center gap-2 transition-all z-10 ${
                    activeCategory === key
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {activeCategory === key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#F47C26] rounded-xl shadow-lg shadow-orange-500/30"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {key === "web" && <FaGlobe />}
                    {key === "app" && <FaMobileAlt />}
                    {key === "design" && <FaPaintBrush />}
                    {category.title ||
                      key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Pricing Cards Grid --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(
              4,
              currentCategory.plans.length || 3
            )} gap-8`}
          >
            {currentCategory.plans?.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-[2rem] transition-all duration-300 group ${
                  plan.isPopular
                    ? "bg-white dark:bg-[#0F1430] scale-105 shadow-2xl shadow-orange-500/20 z-10" // Popular Card Styles
                    : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-2" // Standard Card Styles
                }`}
              >
                {/* Popular Glow Border */}
                {plan.isPopular && (
                  <div className="absolute inset-0 rounded-[2rem] border-2 border-[#F47C26] pointer-events-none"></div>
                )}

                {/* Badge */}
                {(plan.isPopular || plan.badgeText) && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F47C26] text-white text-xs font-bold py-1.5 px-4 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                    <FaRocket className="text-xs" />{" "}
                    {plan.badgeText || "Most Popular"}
                  </div>
                )}

                <div
                  className={`p-8 flex-1 flex flex-col ${
                    plan.isPopular ? "pt-10" : ""
                  }`}
                >
                  {/* Plan Header */}
                  <div className="mb-6 text-center border-b border-gray-100 dark:border-white/5 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium h-8 line-clamp-2">
                      {plan.tagline}
                    </p>
                    <div className="mt-4">
                      <div className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white">
                        {plan.priceTo && plan.priceTo !== plan.priceFrom ? (
                          <div className="flex flex-col items-center">
                            <div>
                              <span className="text-2xl lg:text-3xl">
                                {plan.priceFrom}
                              </span>
                              <span className="mx-2">-</span>
                              <span>{plan.priceTo}</span>
                            </div>
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                              Starting from {plan.priceFrom}
                            </div>
                          </div>
                        ) : (
                          <span>{plan.priceFrom || plan.price}</span>
                        )}
                      </div>
                      {plan.price !== "Contact Us" && (
                        <p className="text-xs text-gray-400 mt-1">
                          Pay as Project Progresses
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack (Visual Pill) */}
                  <div className="mb-6 bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-widest mb-2 flex items-center justify-center gap-1">
                      <FaLaptopCode /> Technology Stack
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {(plan.technologies || []).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-white dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 text-[10px] text-gray-600 dark:text-gray-300 font-medium shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="flex-1 space-y-4 mb-8">
                    <ul className="space-y-3">
                      {(plan.includes || []).map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                            <FaCheck className="text-green-600 dark:text-green-400 text-[10px]" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Excludes (Dimmed) */}
                    {plan.excludes && plan.excludes.length > 0 && (
                      <div className="pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                        <ul className="space-y-2 opacity-60">
                          {plan.excludes.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500"
                            >
                              <FaTimes className="shrink-0 text-red-400" />
                              <span className="line-through decoration-gray-400/50">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? "bg-[#F47C26] text-white hover:bg-[#d5671f] shadow-lg shadow-orange-500/30 hover:-translate-y-1"
                        : "bg-gray-900 dark:bg-white text-white dark:text-[#0a0f2d] hover:bg-gray-800 dark:hover:bg-gray-100"
                    }`}
                  >
                    {plan.price &&
                    typeof plan.price === "string" &&
                    plan.price.includes("1.5L")
                      ? "Contact Sales"
                      : "Get Started Now"}{" "}
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* --- Add-Ons Section --- */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Optional Add-On Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <FaGlobe />, name: "Hosting & Domain" },
              { icon: <FaPaintBrush />, name: "Content Writing" },
              { icon: <FaRocket />, name: "Advanced SEO" },
              { icon: <FaGlobe />, name: "Multi-Language" },
              { icon: <FaServer />, name: "API Integration" },
              { icon: <FaShieldAlt />, name: "Annual AMC" },
            ].map((addon, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/5 hover:border-[#F47C26] dark:hover:border-[#F47C26] hover:shadow-lg transition-all cursor-default group"
              >
                <div className="text-3xl text-gray-300 dark:text-gray-600 group-hover:text-[#F47C26] transition-colors">
                  {addon.icon}
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    {addon.name}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                    Extra Cost
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FAQ Placeholder (Build Trust) --- */}
        <div className="mt-24 bg-gray-100 dark:bg-[#0F1430] rounded-3xl p-8 md:p-12 text-center">
          <FaQuestionCircle className="text-4xl text-[#F47C26] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Have questions about pricing?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We know every project is unique. Let's discuss your specific
            requirements.
          </p>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="text-[#F47C26] font-bold border-b-2 border-[#F47C26] hover:text-orange-600 transition-colors"
          >
            Schedule a Free Consultation
          </button>
        </div>

        {/* Modal Logic */}
        <AnimatePresence>
          {isScheduleModalOpen && (
            <ScheduleMeetingModal
              isOpen={isScheduleModalOpen}
              onClose={() => setIsScheduleModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Pricing;
