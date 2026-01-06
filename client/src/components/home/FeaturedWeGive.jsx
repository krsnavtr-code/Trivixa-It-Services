import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaMobileAlt,
  FaSearchDollar,
  FaShieldAlt,
  FaChartLine,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaRocket />,
    title: "Lightning Fast Performance",
    description:
      "We build utilizing Next.js and optimized caching strategies to ensure your site loads instantly.",
    impact: "Reduces bounce rates by 40% & boosts conversions.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    icon: <FaSearchDollar />,
    title: "SEO-First Architecture",
    description:
      "Clean code structure, semantic HTML, and SSR (Server Side Rendering) built right into the core.",
    impact: "Ranks higher on Google, driving organic traffic.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: 3,
    icon: <FaMobileAlt />,
    title: "Mobile-First Responsiveness",
    description:
      "Fluid designs that adapt perfectly to smartphones, tablets, and desktops without breaking.",
    impact: "Captures the 60% of users browsing on mobile devices.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: 4,
    icon: <FaShieldAlt />,
    title: "Enterprise-Grade Security",
    description:
      "SSL integration, DDOS protection, and secure API architecture to keep data safe.",
    impact: "Builds customer trust and prevents costly data breaches.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: 5,
    icon: <FaChartLine />,
    title: "Scalable Infrastructure",
    description:
      "Built on cloud technologies (AWS/Docker) that grow automatically as your user base expands.",
    impact: "Handles traffic spikes during sales/events effortlessly.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: 6,
    icon: <FaHeadset />,
    title: "Dedicated Support",
    description:
      "We don't just launch and leave. We provide ongoing maintenance and rapid bug fixes.",
    impact: "Ensures 99.9% uptime so your business never stops.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
];

const FeaturedWeGive = () => {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] transition-colors duration-500 overflow-hidden font-sans">
      {/* --- Ambient Background --- */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#F47C26]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- Header --- */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#F47C26] font-bold tracking-widest uppercase text-sm mb-3 block">
              Why Choose Trivixa?
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Features That{" "}
              <span className="text-[#F47C26]">Scale Your Business</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We don't just deliver code; we deliver competitive advantages.
              Here is how our technical excellence translates into your business
              growth.
            </p>
          </motion.div>
        </div>

        {/* --- Features Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:border-[#F47C26] dark:hover:border-[#F47C26] transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center text-2xl mb-6 transition-transform group-hover:scale-110`}
              >
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {feature.description}
              </p>

              {/* Business Impact Badge */}
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10">
                <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider mb-2">
                  Business Impact
                </p>
                <div className="flex items-start gap-2 text-gray-900 dark:text-gray-200 font-medium text-sm">
                  <FaArrowRight
                    className="text-[#F47C26] mt-1 shrink-0"
                    size={12}
                  />
                  {feature.impact}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWeGive;
