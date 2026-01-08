import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaBullhorn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPenNib,
  FaHandshake,
  FaGoogle,
  FaFacebook,
  FaInstagram,
  FaUserSecret,
  FaShieldAlt,
  FaLeaf,
  FaChartLine,
  FaArrowRight,
  FaAd,
} from "react-icons/fa";
import ScheduleMeetingModal from "../components/common/ScheduleMeetingModal";

// --- Data Configuration ---

const seoStrategies = [
  {
    title: "White Hat SEO",
    desc: "100% Ethical strategies following Google guidelines. Builds long-term, sustainable ranking safety.",
    icon: <FaShieldAlt />,
    color: "text-blue-500",
    border: "group-hover:border-blue-500",
  },
  {
    title: "Green Hat SEO",
    desc: "Eco-friendly & sustainable digital practices combined with ethical SEO for conscious brands.",
    icon: <FaLeaf />,
    color: "text-green-500",
    border: "group-hover:border-green-500",
  },
  {
    title: "Black Hat SEO",
    desc: "Aggressive, high-risk strategies for rapid results. (Note: We advise on risks & recovery).",
    icon: <FaUserSecret />,
    color: "text-gray-800 dark:text-gray-400",
    border: "group-hover:border-gray-500",
  },
];

const coreServices = [
  {
    id: "ads",
    title: "Paid Advertising (PPC)",
    icon: <FaBullhorn />,
    desc: "Maximize ROI with targeted campaigns across search and social media.",
    tags: ["Google Ads", "Meta Ads (FB/Insta)", "Google AdSense"],
  },
  {
    id: "smo",
    title: "Social Media (SMO)",
    icon: <FaFacebook />,
    desc: "Build a loyal community and brand presence on platforms where your audience lives.",
    tags: ["Brand Awareness", "Engagement", "Viral Marketing"],
  },
  {
    id: "gmb",
    title: "Google My Business",
    icon: <FaMapMarkerAlt />,
    desc: "Dominate local search. We optimize your GMB profile to get you on the 'Map Pack'.",
    tags: ["Local SEO", "Review Mgmt", "Profile Optimization"],
  },
  {
    id: "email",
    title: "Email Marketing",
    icon: <FaEnvelope />,
    desc: "Direct-to-consumer campaigns that nurture leads and drive repeat sales.",
    tags: ["Newsletters", "Drip Campaigns", "Automation"],
  },
  {
    id: "affiliate",
    title: "Affiliate Marketing",
    icon: <FaHandshake />,
    desc: "Setup and manage affiliate networks to let others sell your products for you.",
    tags: ["Partner Network", "Commission Strategy", "Tracking"],
  },
  {
    id: "content",
    title: "Content Writing",
    icon: <FaPenNib />,
    desc: "SEO-optimized blogs, copy, and articles that rank and convert.",
    price: "₹0.50 / word",
    isHighlight: true,
    tags: ["Blogs", "Web Copy", "Articles"],
  },
];

const DigitalMarketing = () => {
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans relative overflow-hidden selection:bg-[#F47C26] selection:text-white transition-colors duration-500">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange-200/20 dark:bg-[#F47C26]/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* --- Hero Section --- */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#F47C26] font-bold tracking-widest uppercase text-sm mb-4 block">
              360° Growth Solutions
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              Digital {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-orange-600">
                Marketing
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              From ranking #1 on Google to viral social campaigns. We use a
              data-driven mix of SEO, Ads, and Content to scale your business
              revenue.
            </p>
          </motion.div>
        </div>

        {/* --- SEO Deep Dive Section --- */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <FaSearch className="text-[#F47C26]" /> Search Engine Optimization
              (SEO)
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              We cover On-Page, Off-Page, Technical SEO, and Advanced Keyword
              Research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seoStrategies.map((strategy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group p-8 rounded-3xl bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none hover:border-2 ${strategy.border} transition-all duration-300 relative overflow-hidden`}
              >
                <div
                  className={`text-4xl mb-4 ${strategy.color} transition-transform group-hover:scale-110 duration-300`}
                >
                  {strategy.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{strategy.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {strategy.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Core Services Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {coreServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 flex flex-col ${
                service.isHighlight
                  ? "bg-[#F47C26] text-white border-[#F47C26] shadow-xl shadow-orange-500/20"
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 backdrop-blur-xl hover:border-[#F47C26]/50 dark:hover:border-[#F47C26]/50 shadow-lg dark:shadow-none"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`text-3xl ${
                    service.isHighlight ? "text-white" : "text-[#F47C26]"
                  }`}
                >
                  {service.icon}
                </div>
                {service.price && (
                  <span className="bg-white text-[#F47C26] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {service.price}
                  </span>
                )}
              </div>

              <h3
                className={`text-2xl font-bold mb-3 ${
                  service.isHighlight
                    ? "text-white"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {service.title}
              </h3>

              <p
                className={`text-sm mb-6 flex-grow leading-relaxed ${
                  service.isHighlight
                    ? "text-white/90"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {service.desc}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {service.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                      service.isHighlight
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Stats / Why Us --- */}
        <div className="bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/10 rounded-[3rem] p-10 md:p-16 mb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div>
              <h4 className="text-4xl font-black text-[#F47C26] mb-2">10x</h4>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                ROI on Ad Spend
              </p>
            </div>
            <div>
              <h4 className="text-4xl font-black text-blue-500 mb-2">#1</h4>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Page Rankings Achieved
              </p>
            </div>
            <div>
              <h4 className="text-4xl font-black text-green-500 mb-2">0.50₹</h4>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Per Word Content
              </p>
            </div>
          </div>
        </div>

        {/* --- CTA Section --- */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Dominate Your Market?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you need aggressive growth via Ads or organic stability via
            SEO, Trivixa has the strategy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-8 py-4 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get a Free Audit <FaArrowRight />
            </button>
            <Link
              to="/portfolio"
              className="px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isScheduleModalOpen && (
          <ScheduleMeetingModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalMarketing;
