import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaImage, FaArrowRight, FaLayerGroup, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import { getCategories as getCategoriesFromApi } from "../../api/categoryApi";
import { getServicesByCategory } from "../../api/servicesApi";

// Helper function to get the full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${imagePath}`;
};

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
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

        // Deduplicate
        const uniqueCategoriesMap = new Map();
        categoriesData.forEach((cat) => {
          if (cat && cat._id && !uniqueCategoriesMap.has(cat._id)) {
            uniqueCategoriesMap.set(cat._id, cat);
          }
        });
        const uniqueCategories = Array.from(uniqueCategoriesMap.values());

        // Fetch counts if missing
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
        setError("Failed to load expertise domains.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // --- Sub-Component: Category Image ---
  const CategoryImage = React.memo(({ category }) => {
    const [imageError, setImageError] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
      setImageError(false);
      if (category?.image) {
        const url = getImageUrl(category.image);
        const img = new Image();
        img.onload = () => setImageUrl(url);
        img.onerror = () => setImageError(true);
        img.src = url;
        return () => {
          img.onload = null;
          img.onerror = null;
        };
      } else {
        setImageError(true);
      }
    }, [category?.image]);

    return (
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#F47C26]/50 transition-colors duration-300">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={category?.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <FaCode className="text-xl text-gray-400 dark:text-gray-500 group-hover:text-[#F47C26] transition-colors" />
        )}
      </div>
    );
  });

  // --- Render: Loading State ---
  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-[#0a0f2d] relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 mx-auto rounded mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-white/5 mx-auto rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- Render: Error State ---
  if (error) {
    return (
      <div className="py-20 bg-gray-50 dark:bg-[#0a0f2d] text-center transition-colors duration-300">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Render: Main Content ---
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider"
          >
            Our Expertise
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Solutions by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
              Domain
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Navigate our specialized technical domains to find the perfect
            solution for your digital transformation.
          </motion.p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category._id} variants={cardVariants}>
                <Link
                  to={`/services/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group relative block p-6 bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:bg-white/[0.07] dark:hover:border-[#F47C26]/30 dark:hover:shadow-[#F47C26]/10 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-5">
                    <CategoryImage category={category} />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors duration-300 truncate">
                        {category.name}
                      </h3>

                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <FaLayerGroup className="text-[10px]" />
                          {category.courseCount || 0} Projects
                        </span>

                        {/* Hidden arrow that appears on hover */}
                        <span className="text-[#F47C26] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <FaArrowRight className="text-sm" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner glow */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-100/50 to-transparent dark:from-white/5 dark:to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
            <p className="text-gray-500 dark:text-gray-400">
              No domains currently available.
            </p>
          </div>
        )}

        {/* Footer Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-900 dark:bg-white/5 dark:border-white/20 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-sm dark:shadow-none"
          >
            Explore by Category <FaArrowRight className="text-sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
