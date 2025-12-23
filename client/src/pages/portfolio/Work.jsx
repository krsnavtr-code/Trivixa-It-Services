import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowRight,
  FaFilter,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

// --- Sample Data (You can move this to an API or separate file later) ---
const allProjects = [
  {
    id: 1,
    title: "FinTrack Banking",
    category: "web",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1600&auto=format&fit=crop",
    description:
      "A comprehensive dashboard for tracking personal finances, featuring real-time graphical data visualization.",
    tech: ["React", "D3.js", "Firebase"],
    links: { demo: "#", github: "#" },
  },
  {
    id: 2,
    title: "HealthPlus App",
    category: "mobile",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop",
    description:
      "Telemedicine mobile application allowing patients to book appointments and consult doctors via video.",
    tech: ["React Native", "WebRTC", "Node.js"],
    links: { demo: "#", github: "#" },
  },
  {
    id: 3,
    title: "AeroTravel UI",
    category: "design",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop",
    description:
      "High-fidelity UI/UX design kit for a travel booking agency, focused on accessibility and motion.",
    tech: ["Figma", "Protopie"],
    links: { demo: "#", github: "#" },
  },
  {
    id: 4,
    title: "E-Shop Redux",
    category: "web",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1600&auto=format&fit=crop",
    description:
      "Scalable e-commerce frontend with Redux Toolkit state management and Stripe integration.",
    tech: ["React", "Redux", "Stripe"],
    links: { demo: "#", github: "#" },
  },
  {
    id: 5,
    title: "CryptoWatch",
    category: "mobile",
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1600&auto=format&fit=crop",
    description:
      "Real-time cryptocurrency tracker app using CoinGecko API with price alerts.",
    tech: ["Flutter", "API Integration"],
    links: { demo: "#", github: "#" },
  },
  {
    id: 6,
    title: "Portfolio v1",
    category: "web",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop",
    description:
      "My previous personal portfolio site built with Gatsby and GraphQL.",
    tech: ["Gatsby", "GraphQL"],
    links: { demo: "#", github: "#" },
  },
];

const Projects = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === filter);

  // --- Theme Colors ---
  const bgClass = isDark ? "bg-[#020e0a]" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";

  // Card & Element Styles
  const cardBg = isDark
    ? "bg-[#051a12]/40 border-[#074F3E]/30 hover:border-[#34d399]/50"
    : "bg-white border-gray-200 shadow-lg hover:shadow-xl";

  // Filter Button Styles
  const getFilterClass = (category) => {
    const isActive = filter === category;
    if (isDark) {
      return isActive
        ? "bg-[#074F3E] text-white shadow-[#074F3E]/40"
        : "bg-[#051a12] text-gray-400 hover:text-white border border-[#074F3E]/20";
    } else {
      return isActive
        ? "bg-[#074F3E] text-white shadow-lg"
        : "bg-white text-gray-600 hover:text-[#074F3E] border border-gray-200";
    }
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 overflow-hidden relative transition-colors duration-500 ${bgClass}`}
    >
      {/* --- Background Ambience --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-[#074F3E]/20" : "bg-[#074F3E]/5"
          }`}
        ></div>
        <div
          className={`absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-[#34d399]/10" : "bg-[#34d399]/5"
          }`}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 ${
                isDark
                  ? "border-[#34d399]/30 bg-[#074F3E]/20 text-[#34d399]"
                  : "border-[#074F3E]/20 bg-[#074F3E]/5 text-[#074F3E]"
              }`}
            >
              Portfolio
            </div>
            <h1 className={`text-4xl md:text-6xl font-black mb-6 ${textMain}`}>
              Selected{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#074F3E] via-[#10b981] to-[#34d399]">
                Works
              </span>
            </h1>
            <p className={`max-w-2xl mx-auto text-lg ${textSub}`}>
              A collection of projects that demonstrate my ability to translate
              complex requirements into clean, effective software solutions.
            </p>
          </motion.div>

          {/* --- Filters --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {[
              { id: "all", label: "All Projects" },
              { id: "web", label: "Web Dev" },
              { id: "mobile", label: "Mobile Apps" },
              { id: "design", label: "UI/UX" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md ${getFilterClass(
                  cat.id
                )}`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* --- Projects Grid --- */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className={`group rounded-[2rem] overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${cardBg}`}
              >
                {/* Image Section */}
                <div className="h-60 overflow-hidden relative">
                  <div
                    className={`absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10`}
                  ></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay Links (Visible on Hover) */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.links.github}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                      title="View Code"
                    >
                      <FaGithub />
                    </a>
                    <a
                      href={project.links.demo}
                      className="p-3 bg-[#074F3E] text-white rounded-full hover:scale-110 transition-transform"
                      title="Live Demo"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold ${textMain}`}>
                      {project.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                        isDark
                          ? "border-[#34d399]/30 text-[#34d399]"
                          : "border-[#074F3E]/30 text-[#074F3E]"
                      }`}
                    >
                      {project.category}
                    </span>
                  </div>

                  <p className={`text-sm mb-6 line-clamp-2 ${textSub}`}>
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className={`text-xs px-2 py-1 rounded-md ${
                          isDark
                            ? "bg-[#074F3E]/20 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                      isDark
                        ? "text-[#34d399] hover:text-white"
                        : "text-[#074F3E] hover:text-black"
                    }`}
                  >
                    View Details <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
