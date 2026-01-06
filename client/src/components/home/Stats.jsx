import React, { useEffect, useRef } from "react";
import {
  FaProjectDiagram,
  FaSmile,
  FaCode,
  FaClock,
  FaUsers,
  FaTools,
  FaHandshake,
  FaRocket,
} from "react-icons/fa";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// --- Data: Trust Signals for a Startup ---
const stats = [
  {
    id: 1,
    name: "Projects Delivered",
    value: 21,
    suffix: "+",
    icon: FaProjectDiagram,
    description: "Successful Deployments",
  },
  {
    id: 2,
    name: "Client Satisfaction",
    value: 98,
    suffix: "%",
    icon: FaSmile,
    description: "5-Star Rating Average",
  },
  {
    id: 3,
    name: "Years Experience",
    value: 2,
    suffix: "+",
    icon: FaRocket,
    description: "Delivering Excellence",
  },
  {
    id: 4,
    name: "Tech Stack",
    value: 15,
    suffix: "+",
    icon: FaTools,
    description: "Technologies Mastered",
  },
  {
    id: 5,
    name: "On-Time Delivery",
    value: 100,
    suffix: "%",
    icon: FaClock,
    description: "Commitment to Deadlines",
  },
  {
    id: 6,
    name: "Active Users",
    value: 50,
    suffix: "k+",
    icon: FaUsers,
    description: "Impacted by our Solutions",
  },
  {
    id: 7,
    name: "Lines of Code",
    value: 100,
    suffix: "k+",
    icon: FaCode,
    description: "Clean & Scalable Code",
  },
  {
    id: 8,
    name: "Clients Referrals",
    value: 85,
    suffix: "%",
    icon: FaHandshake,
    description: "Building Long-term Relations",
  },
];

// --- Sub-Component: Animated Counter ---
const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 }); // Smoother no-bounce

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        // Handle decimals if needed, here we floor it
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref} className="tabular-nums" />;
};

// --- Main Stats Component ---
const Stats = () => {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden border-y border-gray-200 dark:border-white/5 transition-colors duration-500 font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F47C26]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Growing by <span className="text-[#F47C26]">Delivering Value</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We might be young, but our impact is significant. Here is what we
            have achieved so far.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="relative group p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-none hover:border-[#F47C26]/30 dark:hover:border-[#F47C26]/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Layout: Icon + Number Side by Side for compactness */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xl text-blue-600 dark:text-blue-400 group-hover:bg-[#F47C26] group-hover:text-white transition-colors duration-300">
                  <stat.icon />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </h3>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <p className="text-xs font-bold text-[#F47C26] uppercase tracking-wider mb-1">
                  {stat.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {stat.description}
                </p>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#F47C26]/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
