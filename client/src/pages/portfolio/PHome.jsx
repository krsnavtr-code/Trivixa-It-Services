import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
} from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";
import { useTheme } from "../../context/ThemeContext";

// --- Sample Data ---
const projects = [
  {
    id: 1,
    title: "Nebula E-Commerce",
    description:
      "A headless e-commerce architecture with real-time inventory management and AI recommendations.",
    category: "web",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1600&auto=format&fit=crop",
    tags: ["React", "Node.js", "Stripe"],
  },
  {
    id: 2,
    title: "Orbital Task App",
    description:
      "Productivity suite featuring AI-driven task prioritization and seamless cloud sync.",
    category: "mobile",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1600&auto=format&fit=crop",
    tags: ["React Native", "Firebase"],
  },
  {
    id: 3,
    title: "Quantum Portfolio",
    description:
      "High-performance personal branding site with WebGL interactions and 3D assets.",
    category: "design",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
    tags: ["Three.js", "Framer Motion"],
  },
  {
    id: 4,
    title: "FinTech Analytics",
    description:
      "Real-time financial analytics dashboard with predictive modeling and data visualization.",
    category: "web",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    tags: ["Next.js", "D3.js"],
  },
];

const techStack = [
  { icon: <FaReact />, name: "React" },
  { icon: <SiNextdotjs />, name: "Next.js" },
  { icon: <SiTypescript />, name: "TypeScript" },
  { icon: <FaNodeJs />, name: "Node.js" },
  { icon: <FaAws />, name: "AWS" },
  { icon: <FaDocker />, name: "Docker" },
];

const PHome = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const { theme } = useTheme();

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Dev" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "design", label: "UI/UX" },
  ];

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === activeFilter));
    }
  }, [activeFilter]);

  // --- Dynamic Styles ---
  const isDark = theme === "dark";
  
  // Colors
  const emeraldDark = "#074F3E"; // Deep Green
  const emeraldLight = "#34d399"; // Mint Highlight
  
  const bgClass = isDark ? "bg-[#020e0a]" : "bg-gray-50"; // Matches Navbar bg
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";

  // Cards
  const cardBg = isDark
    ? "bg-[#051a12] border-[#074F3E]/30"
    : "bg-white border-gray-200 shadow-xl";
  const overlayCardBg = isDark
    ? "bg-[#020e0a]/90 backdrop-blur-xl border-[#074F3E]/30"
    : "bg-white/95 backdrop-blur-xl border-gray-100 shadow-2xl";

  // Filter Buttons
  const filterContainerBg = isDark
    ? "bg-[#074F3E]/10 border-[#074F3E]/20"
    : "bg-white border-gray-200 shadow-sm";
  const filterInactiveText = isDark
    ? "text-gray-400 hover:text-white"
    : "text-gray-500 hover:text-gray-900";

  return (
    <div
      className={`min-h-screen pt-24 pb-20 overflow-hidden relative transition-colors duration-500 ${bgClass}`}
    >
      {/* --- Background Ambience --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Top Right Green Glow */}
        <div
          className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] ${
            isDark ? "bg-[#074F3E]/20" : "bg-[#074F3E]/5"
          }`}
        ></div>
        {/* Bottom Left Mint Glow */}
        <div
          className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] ${
            isDark ? "bg-[#34d399]/10" : "bg-[#34d399]/5"
          }`}
        ></div>
        {isDark && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Hero Section --- */}
        <section className="text-center py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 ${
              isDark 
                ? "border-[#34d399]/30 bg-[#074F3E]/20 text-[#34d399]"
                : "border-[#074F3E]/20 bg-[#074F3E]/5 text-[#074F3E]"
            }`}>
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
              Available for Hire
            </div>

            <h1
              className={`text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight ${textMain}`}
            >
              Building the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#074F3E] via-[#10b981] to-[#34d399] animate-gradient-x">
                Digital Future
              </span>
            </h1>

            <p
              className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light ${textSub}`}
            >
              I architect immersive web experiences and robust applications that
              solve real-world problems with precision, speed, and style.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                to="/contact"
                className={`px-8 py-4 font-bold rounded-full transition-all shadow-lg transform hover:scale-105 ${
                    isDark 
                    ? "bg-[#074F3E] text-white hover:bg-[#0a6650] shadow-[#074F3E]/20"
                    : "bg-[#074F3E] text-white hover:bg-[#0a6650]"
                }`}
              >
                Start a Project
              </Link>
              <Link
                to="/projects"
                className={`px-8 py-4 border font-bold rounded-full transition-all backdrop-blur-sm ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm"
                }`}
              >
                View Selected Work
              </Link>
            </div>
          </motion.div>

          {/* Tech Stack Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={`mt-20 flex flex-wrap justify-center gap-8 md:gap-12 transition-all duration-500 ${
              isDark
                ? "opacity-50 grayscale hover:grayscale-0"
                : "opacity-70 grayscale hover:grayscale-0"
            }`}
          >
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 group cursor-default"
              >
                <div
                  className={`text-3xl md:text-4xl transition-colors transform group-hover:scale-110 duration-300 ${
                    isDark ? "text-white" : "text-gray-800"
                  } group-hover:text-[#34d399]`}
                >
                  {tech.icon}
                </div>
                <span
                  className={`text-xs font-mono hidden md:block opacity-0 group-hover:opacity-100 transition-opacity ${textSub}`}
                >
                  {tech.name}
                </span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* --- Process / Workflow Visualization --- */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold mb-2 ${textMain}`}>
              My Engineering Process
            </h2>
            <p className={textSub}>
              From concept to deployment, ensuring scalability at every step.
            </p>
          </div>

          <div
            className={`rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group transition-colors duration-300 ${
              isDark
                ? "bg-[#051a12]/50 border border-[#074F3E]/30 shadow-2xl"
                : "bg-white border border-gray-200 shadow-xl"
            }`}
          >
            {/* Decorative glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#074F3E] to-transparent opacity-50`}></div>

            {/* Placeholder for a diagram or graphic */}
             <div className="h-32 flex items-center justify-center text-sm italic opacity-50">
               {/* You can insert a real diagram here later */}
               [Process Visualization Area]
             </div>
          </div>
        </motion.section>

        {/* --- Filters --- */}
        <div className="flex justify-center mb-16">
          <div
            className={`flex flex-wrap justify-center gap-2 p-1.5 rounded-full border backdrop-blur-md transition-colors ${filterContainerBg}`}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`relative px-6 py-2 rounded-full text-sm font-bold transition-colors z-10 ${
                  activeFilter === cat.id ? "text-white" : filterInactiveText
                }`}
              >
                {activeFilter === cat.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-[#074F3E] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- Projects Grid --- */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className={`group relative rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-[#34d399]/50 border ${cardBg}`}
              >
                {/* Image Area */}
                <div className="relative h-72 sm:h-96 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-10 transition-opacity duration-500 ${
                      isDark
                        ? "from-[#020e0a] opacity-90 group-hover:opacity-60"
                        : "from-white opacity-60 group-hover:opacity-20"
                    }`}
                  ></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Floating Tags */}
                  <div className="absolute top-6 left-6 z-20 flex gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-[10px] uppercase font-bold backdrop-blur-md border rounded-full tracking-wider ${
                          isDark
                            ? "bg-[#074F3E]/80 border-[#34d399]/30 text-white"
                            : "bg-white/90 border-gray-200 text-gray-900 shadow-sm"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Overlay Card */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div
                    className={`p-6 rounded-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border ${overlayCardBg}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3
                          className={`text-2xl font-bold mb-2 group-hover:text-[#34d399] transition-colors ${textMain}`}
                        >
                          {project.title}
                        </h3>
                        <p
                          className={`text-sm line-clamp-2 leading-relaxed ${textSub}`}
                        >
                          {project.description}
                        </p>
                      </div>
                      <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 shadow-lg ${
                          isDark ? "bg-[#074F3E] shadow-[#074F3E]/40" : "bg-[#074F3E]"
                      }`}>
                        <FaArrowRight />
                      </div>
                    </div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-xs font-bold uppercase tracking-widest text-[#34d399] hover:text-[#074F3E] transition-colors"
                    >
                      View Case Study
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- Call to Action --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mt-32 relative rounded-3xl overflow-hidden border group ${
            isDark ? "border-[#34d399]/20" : "border-gray-200 shadow-2xl"
          }`}
        >
          {/* CTA Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-r backdrop-blur-3xl group-hover:opacity-80 transition-opacity duration-500 ${
              isDark
                ? "from-[#074F3E]/30 to-[#34d399]/10"
                : "from-[#074F3E]/10 to-[#34d399]/10"
            }`}
          ></div>

          <div className="relative z-10 px-8 py-20 text-center">
            <h2 className={`text-4xl md:text-5xl font-black mb-6 ${textMain}`}>
              Have an idea? Let's build it.
            </h2>
            <p className={`mb-10 max-w-2xl mx-auto text-lg ${textSub}`}>
              From concept to code, I help brands launch digital products that
              stand out in the noise.
            </p>
            <Link
              to="/contact"
              className={`inline-flex items-center gap-3 px-10 py-4 font-bold rounded-full transition-all transform hover:scale-105 shadow-lg ${
                isDark
                  ? "bg-white text-[#074F3E] hover:bg-gray-100"
                  : "bg-[#074F3E] text-white hover:bg-[#0a6650]"
              }`}
            >
              Start a Conversation <FaArrowRight />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PHome;