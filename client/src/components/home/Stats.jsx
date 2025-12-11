import React, { useEffect, useRef } from "react";
import { FaProjectDiagram, FaSmile, FaCode, FaTrophy } from "react-icons/fa";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// --- Data: Tailored for an IT Agency ---
const stats = [
  {
    id: 1,
    name: "Projects Delivered",
    value: 150,
    suffix: "+",
    icon: FaProjectDiagram,
    description: "From MVPs to Enterprise Scaling",
  },
  {
    id: 2,
    name: "Happy Clients",
    value: 98,
    suffix: "%",
    icon: FaSmile,
    description: "Retention Rate & Satisfaction",
  },
  {
    id: 3,
    name: "Years Experience",
    value: 8,
    suffix: "+",
    icon: FaCode,
    description: "Delivering Excellence Since 2016",
  },
  {
    id: 4,
    name: "Industry Awards",
    value: 12,
    suffix: "",
    icon: FaTrophy,
    description: "Recognized for Innovation",
  },
];

// --- Sub-Component: Animated Counter ---
const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  // Hook to update text content during animation
  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref} className="tabular-nums" />;
};

// --- Main Stats Component ---
const Stats = () => {
  return (
    <section className="relative py-20 bg-[#0a0f2d] overflow-hidden border-y border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

      {/* Glow Effect behind numbers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-2 text-center"
            >
              {/* Icon Bubble */}
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#F47C26]/50 group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <stat.icon className="text-2xl text-blue-300 group-hover:text-[#F47C26] transition-colors" />
              </div>

              {/* Number with Counter Animation */}
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix} />
              </h3>

              {/* Label */}
              <p className="text-lg font-bold text-[#F47C26] mb-2 uppercase tracking-wide text-xs">
                {stat.name}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {stat.description}
              </p>

              {/* Hover Glow Gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
