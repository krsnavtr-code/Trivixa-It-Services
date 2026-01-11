import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaBullhorn,
  FaMapMarkerAlt,
  FaPenNib,
  FaHandshake,
  FaFacebook,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
  FaLaptopCode,
  FaUsers,
  FaFileAlt,
  FaSmile,
} from "react-icons/fa";
import ScheduleMeetingModal from "../components/common/ScheduleMeetingModal";

// --- Data Configuration ---

const services = [
  {
    id: "seo",
    title: "1. SEO (Search Engine Optimization)",
    icon: <FaSearch />,
    desc: "Rank higher and drive organic traffic with our comprehensive SEO strategies.",
    features: [
      "On Page SEO (Meta tags, URL, Internal linking)",
      "Technical SEO (Speed, Mobile-friendly, Indexing)",
      "Keyword Research & Strategy",
      "Off Page SEO (Backlinks, Guest posting)",
      "Monthly SEO Reporting & Analytics",
    ],
    keywords: [
      "On-Page SEO",
      "Technical SEO",
      "Backlinks",
      "Keyword Research",
      "Google Analytics",
    ],
    color: "text-blue-500",
    border: "group-hover:border-blue-500",
  },
  {
    id: "smo",
    title: "2. SMO (Social Media Optimization)",
    icon: <FaFacebook />,
    desc: "Build a loyal community and brand presence where your audience lives.",
    features: [
      "Facebook, Instagram, LinkedIn Optimization",
      "Profile Setup & Professional Branding",
      "Regular Post Sharing & Scheduling",
      "Engagement Growth (Likes, Comments)",
      "Monthly Performance Reports",
    ],
    keywords: [
      "Social Media Marketing",
      "Facebook Ads",
      "Instagram Growth",
      "Brand Awareness",
      "LinkedIn Marketing",
    ],
    color: "text-purple-500",
    border: "group-hover:border-purple-500",
  },
  {
    id: "ads",
    title: "3. Google Ads (PPC Advertising)",
    icon: <FaBullhorn />,
    desc: "Instant traffic and leads with targeted Pay-Per-Click campaigns.",
    features: [
      "Search Ads (Text based)",
      "Display Ads (Visual banners)",
      "YouTube Video Ads",
      "Conversion Tracking Setup",
      "Budget & Bid Optimization",
    ],
    keywords: [
      "PPC Management",
      "Google Ads",
      "YouTube Ads",
      "Conversion Rate",
      "Display Advertising",
    ],
    color: "text-green-500",
    border: "group-hover:border-green-500",
  },
  {
    id: "content",
    title: "4. Content Writing",
    icon: <FaPenNib />,
    desc: "Persuasive copy that engages readers and converts them into customers.",
    features: [
      "Website Copywriting",
      "SEO Blogs & Articles",
      "Product Descriptions",
      "Social Media Captions",
      "Ad Copy Writing",
    ],
    keywords: [
      "Content Marketing",
      "Blog Writing",
      "Copywriting",
      "SEO Content",
      "Web Content",
    ],
    color: "text-orange-500",
    border: "group-hover:border-orange-500",
  },
];

const whyChooseUs = [
  {
    icon: <FaUsers />,
    title: "Experienced Team",
    desc: "Expert digital marketers.",
  },
  {
    icon: <FaChartLine />,
    title: "Result-Oriented",
    desc: "Strategies that deliver ROI.",
  },
  {
    icon: <FaHandshake />,
    title: "Affordable Pricing",
    desc: "Best value for your budget.",
  },
  {
    icon: <FaFileAlt />,
    title: "Transparent Reports",
    desc: "Monthly performance tracking.",
  },
  {
    icon: <FaSmile />,
    title: "100% Satisfaction",
    desc: "Dedicated client support.",
  },
];

const DigitalMarketing = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans relative overflow-hidden transition-colors duration-500">
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
              Grow Your Business Online
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              Our Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-orange-600">
                Marketing Services
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              From SEO to Social Media, we provide end-to-end digital solutions
              to help you reach your target audience and increase sales.
            </p>
            <div className="mt-8">
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="px-8 py-4 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 inline-flex items-center gap-2"
              >
                Get a Free Strategy Call <FaArrowRight />
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- Services Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-8 rounded-3xl bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none hover:border-2 ${service.border} transition-all duration-300 flex flex-col h-full`}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`text-4xl ${service.color} transition-transform group-hover:scale-110 duration-300 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl`}
                >
                  {service.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                {service.desc}
              </p>

              <div className="flex-grow">
                <h4 className="text-sm font-bold uppercase text-gray-500 mb-3 tracking-wider">
                  Services Include:
                </h4>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <FaCheckCircle
                        className={`mt-1 flex-shrink-0 ${service.color}`}
                        size={14}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">
                  Key Focus:
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.keywords.map((kw, k) => (
                    <span
                      key={k}
                      className="text-[10px] bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-600 dark:text-gray-400 font-medium border border-gray-200 dark:border-white/10"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Why Choose Us Section --- */}
        <div className="bg-[#0F1430] text-white rounded-[3rem] p-10 md:p-16 mb-24 relative overflow-hidden border border-white/10">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F47C26]/20 rounded-full blur-[100px]"></div>

          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We don't just deliver services; we deliver measurable results that
              build trust and revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl text-[#F47C26] mb-4 group-hover:bg-[#F47C26] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- CTA Section --- */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Scale Your Business?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Start your journey to digital dominance today. Let's discuss a
            custom strategy for your brand.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-8 py-4 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Get Started Now <FaArrowRight />
            </button>
            <Link
              to="/pricing"
              className="px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              View Pricing Plans
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
