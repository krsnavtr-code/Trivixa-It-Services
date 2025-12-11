import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaHandshake,
  FaLaptopCode,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Content = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-24 bg-[#0a0f2d] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            Who We Are
          </span>
          <h2 className="mt-6 text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Your Partner in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
              Digital Evolution
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Trivixa is not just a dev shop; we are your strategic technology
            partner. We bridge the gap between complex business problems and
            elegant digital solutions, helping startups and enterprises scale
            without limits.
          </p>
        </motion.div>

        {/* --- Why Choose Trivixa Grid --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24"
        >
          {[
            {
              icon: <FaLaptopCode />,
              title: "Full-Cycle Development",
              desc: "From initial brainstorming to post-launch maintenance, we handle the entire software lifecycle so you can focus on business.",
            },
            {
              icon: <FaHandshake />,
              title: "Client-Centric Approach",
              desc: "We don't just write code; we align with your business goals. Your success metric is our only KPI.",
            },
            {
              icon: <FaRocket />,
              title: "Agile & Scalable",
              desc: "Built for speed and flexibility. We deliver MVPs fast and scale architectures effortlessly as you grow.",
            },
            {
              icon: <FaChartLine />,
              title: "Data-Driven Results",
              desc: "Our solutions are engineered for performance, SEO, and high conversion rates, ensuring tangible ROI.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-300 group-hover:text-[#F47C26] group-hover:bg-[#F47C26]/10 transition-colors text-2xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#F47C26] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- 3-Step Engagement Model --- */}
        <div className="relative mb-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl -z-10"></div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white">
                How We Transform Your Business
              </h3>
              <p className="text-gray-400 mt-2">
                Simple, transparent, and effective.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent border-t border-dashed border-gray-600 z-0"></div>

              {[
                {
                  step: "01",
                  title: "Consult & Strategy",
                  desc: "We map out your vision, define technical requirements, and build a roadmap.",
                },
                {
                  step: "02",
                  title: "Build & Deploy",
                  desc: "Our experts develop your product using cutting-edge tech stacks with regular updates.",
                },
                {
                  step: "03",
                  title: "Scale & Support",
                  desc: "We monitor performance, optimize for growth, and provide 24/7 technical support.",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto bg-[#0a0f2d] border border-white/20 rounded-full flex items-center justify-center text-xl font-bold text-white mb-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <span className="text-[#F47C26]">{item.step}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Final CTA --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-[#F47C26] to-[#d5671f] rounded-3xl p-10 md:p-16 shadow-2xl shadow-orange-500/20 relative overflow-hidden"
        >
          {/* Decorative Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              Ready to Digitalize Your Vision?
            </h3>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Join hundreds of successful businesses who have scaled with
              Trivixa. Let's build something extraordinary together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <button className="px-8 py-4 bg-white text-[#d5671f] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
                  Start a Project <FaArrowRight />
                </button>
              </Link>
              <Link to="/services">
                <button className="px-8 py-4 bg-black/20 text-white font-bold rounded-xl border border-white/30 hover:bg-black/30 transition-colors">
                  View Our Services
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Content;
