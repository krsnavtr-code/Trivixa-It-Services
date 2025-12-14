import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCode,
  FaLaptopCode,
  FaServer,
  FaMobileAlt,
  FaDatabase,
  FaLayerGroup,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getCategories as getCategoriesFromApi } from "../../api/categoryApi";
import { getServicesByCategory } from "../../api/servicesApi";

// --- Icons Helper (Mapping category names to icons) ---
const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("web") || n.includes("frontend")) return <FaLaptopCode />;
  if (n.includes("backend") || n.includes("server")) return <FaServer />;
  if (n.includes("mobile") || n.includes("app")) return <FaMobileAlt />;
  if (n.includes("data")) return <FaDatabase />;
  return <FaCode />;
};

// --- Animations ---
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategoriesFromApi({
          showOnHome: true,
          limit: 6,
          sort: "-courseCount",
          fields: "_id,name,slug,courseCount,image,description,showOnHome",
        });

        const categoriesData = Array.isArray(response)
          ? response
          : response.data || [];

        const uniqueCategoriesMap = new Map();
        categoriesData.forEach((cat) => {
          if (cat && cat._id && !uniqueCategoriesMap.has(cat._id)) {
            uniqueCategoriesMap.set(cat._id, cat);
          }
        });
        const uniqueCategories = Array.from(uniqueCategoriesMap.values());

        const categoriesWithCount = await Promise.all(
          uniqueCategories.map(async (category) => {
            if (
              category.courseCount === undefined ||
              category.courseCount === null
            ) {
              try {
                const courses = await getServicesByCategory(category._id);
                return {
                  ...category,
                  courseCount: Array.isArray(courses) ? courses.length : 0,
                };
              } catch (err) {
                return { ...category, courseCount: 0 };
              }
            }
            return category;
          })
        );

        const sortedCategories = categoriesWithCount
          .sort((a, b) => (b.courseCount || 0) - (a.courseCount || 0))
          .slice(0, 6);

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load project domains.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // --- Render: Loading State ---
  if (loading) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-[#0a0f2d] relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;

  // --- Render: Main Content ---
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-300">
      {/* Background: Technical Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#F47C26] font-bold uppercase tracking-widest text-xs"
            >
              Our Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight"
            >
              Project{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Domains
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-600 dark:text-gray-400 text-lg"
            >
              We specialize in building scalable solutions across diverse
              technical ecosystems. Explore our work by category.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/categories"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b-2 border-[#F47C26] pb-1 hover:text-[#F47C26] transition-colors"
            >
              View All Domains <FaArrowRight />
            </Link>
          </motion.div>
        </div>

        {/* Diagram: Showing diversity of project domains */}
        <div className="flex justify-center mb-12 opacity-80 h-0 w-0 overflow-hidden"></div>

        {/* Grid Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div key={category._id} variants={itemVariants}>
              <Link
                to={`/services/category/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="group relative block h-full"
              >
                <div className="h-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 dark:hover:border-[#F47C26]/50 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 overflow-hidden">
                  {/* Hover Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F47C26] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>

                  <div className="flex flex-col h-full">
                    {/* Header: Icon & Count */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-white/10 flex items-center justify-center text-2xl text-gray-700 dark:text-gray-300 group-hover:bg-[#F47C26] group-hover:text-white transition-colors duration-300 shadow-sm">
                        {getCategoryIcon(category.name)}
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-black/20 px-3 py-1 rounded-full border border-gray-200 dark:border-white/5">
                        <FaLayerGroup className="text-[#F47C26]" />
                        {category.courseCount || 0} Projects
                      </span>
                    </div>

                    {/* Content: Title & Desc */}
                    <div className="mb-6 flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#F47C26] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {category.description ||
                          `Expert solutions and deployed projects in the field of ${category.name}.`}
                      </p>
                    </div>

                    {/* Footer: Tech Stack Indicators (Visual) */}
                    <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                      <div className="flex -space-x-2 overflow-hidden">
                        {/* Fake avatars for "Team" or "Tech" visuals */}
                        <div className="inline-block h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 ring-2 ring-white dark:ring-[#0a0f2d] flex items-center justify-center text-[8px] font-bold text-blue-600 dark:text-blue-300">
                          TS
                        </div>
                        <div className="inline-block h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900 ring-2 ring-white dark:ring-[#0a0f2d] flex items-center justify-center text-[8px] font-bold text-yellow-600 dark:text-yellow-300">
                          JS
                        </div>
                        <div className="inline-block h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 ring-2 ring-white dark:ring-[#0a0f2d] flex items-center justify-center text-[8px] font-bold text-green-600 dark:text-green-300">
                          N
                        </div>
                      </div>

                      <span className="text-xs font-bold text-[#F47C26] flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View Projects <FaArrowRight />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/categories"
            className="inline-block px-6 py-3 bg-[#F47C26] text-white font-bold rounded-lg shadow-lg hover:bg-[#d5671f] transition-colors"
          >
            View All Domains
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
