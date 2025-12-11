import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories as getCategoriesFromApi } from "../../api/categoryApi";
import { getCoursesByCategory } from "../../api/courseApi";
import {
  FaArrowRight,
  FaLayerGroup,
  FaCode,
  FaServer,
  FaBrain,
  FaShieldAlt,
  FaMobile,
  FaPaintBrush,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Helper to get icon for a service category
const getCategoryIcon = (name) => {
  const n = name?.toLowerCase() || "";
  if (n.includes("web")) return <FaCode />;
  if (n.includes("cloud") || n.includes("devops")) return <FaServer />;
  if (n.includes("ai") || n.includes("data")) return <FaBrain />;
  if (n.includes("security") || n.includes("cyber")) return <FaShieldAlt />;
  if (n.includes("mobile") || n.includes("app")) return <FaMobile />;
  if (n.includes("design") || n.includes("ui")) return <FaPaintBrush />;
  return <FaLayerGroup />; // Default
};

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      try {
        const response = await getCategoriesFromApi({ limit: 100 });
        const categoriesData = Array.isArray(response)
          ? response
          : response?.data || [];

        if (!categoriesData.length) {
          setError("No domains found.");
          setLoading(false);
          return;
        }

        const categoriesWithCount = await Promise.all(
          categoriesData.map(async (category) => {
            if (!category || !category._id) return null;
            try {
              const courses = await getCoursesByCategory(category._id);
              return {
                ...category,
                courseCount: Array.isArray(courses) ? courses.length : 0,
              };
            } catch (err) {
              return { ...category, courseCount: 0 };
            }
          })
        );

        setCategories(categoriesWithCount.filter(Boolean));
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load expertise domains.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithCount();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f2d] flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl max-w-md text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f2d] text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none fixed"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F47C26]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F47C26] text-xs font-bold uppercase tracking-wider">
              Core Competencies
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
              Our Areas of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Expertise
              </span>
            </h1>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
              Explore our specialized technological domains. We deliver
              excellence across the entire digital spectrum.
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category._id} variants={itemVariants}>
                <Link
                  to={`/services/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group relative block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Icon Container */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center text-2xl text-blue-300 group-hover:text-[#F47C26] group-hover:scale-110 transition-all duration-300 shadow-inner">
                      {getCategoryIcon(category.name)}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-[#F47C26] group-hover:text-white transition-all duration-300">
                      <FaArrowRight className="text-xs transform group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#F47C26] transition-colors">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10 leading-relaxed">
                      {category.description ||
                        "Specialized solutions tailored to drive efficiency and innovation in this domain."}
                    </p>

                    <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-[#F47C26]"></span>
                      {category.courseCount || 0} Solutions Available
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F47C26]/0 via-[#F47C26]/5 to-[#F47C26]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
