import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import { getServicesByCategory } from "../api/servicesApi";
import {
  FaChevronDown,
  FaChevronRight,
  FaCode,
  FaServer,
  FaBrain,
  FaShieldAlt,
  FaMobile,
  FaPaintBrush,
  FaLayerGroup,
  FaArrowRight,
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

const CourseMenu = ({ isMobile = false, onItemClick = () => {} }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryCourses, setCategoryCourses] = useState({});
  const [isLoadingCourses, setIsLoadingCourses] = useState({});

  // Fetch categories logic
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getCategories({
          limit: 12,
          fields: "_id,name,slug,courseCount,isActive",
          sort: "name",
        });

        let categoriesData = [];
        if (Array.isArray(response)) categoriesData = response;
        else if (response?.data && Array.isArray(response.data))
          categoriesData = response.data;
        else if (response?.docs && Array.isArray(response.docs))
          categoriesData = response.docs;

        if (categoriesData.length === 0) {
          const fallback = await getCategories({});
          categoriesData = Array.isArray(fallback)
            ? fallback
            : fallback?.data || [];
        }

        const processedCategories = categoriesData
          .filter((cat) => cat && cat._id && cat.name)
          .map((category) => ({
            id: category._id,
            name: category.name,
            slug: category.slug || category._id,
            courseCount: category.courseCount || category.courses,
          }));

        setCategories(processedCategories);

        // Set first category as active by default on Desktop
        if (!isMobile && processedCategories.length > 0) {
          setActiveCategory(processedCategories[0].id);
          fetchCategoryCourses(processedCategories[0].id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load services.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isMobile]); // Re-run if view changes, though unlikely dynamically

  // Fetch courses for a category
  const fetchCategoryCourses = useCallback(
    async (categoryId) => {
      if (!categoryId || categoryCourses[categoryId]) return;

      try {
        setIsLoadingCourses((prev) => ({ ...prev, [categoryId]: true }));
        const params = {
          limit: 5,
          fields: "_id,title,slug,price,rating",
          status: "published",
          category: categoryId,
        };

        const response = await getServicesByCategory(categoryId, params);
        const courses = Array.isArray(response)
          ? response
          : response?.data || [];

        setCategoryCourses((prev) => ({ ...prev, [categoryId]: courses }));
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoadingCourses((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [categoryCourses]
  );

  // Handlers
  const handleMouseEnter = (categoryId) => {
    if (!isMobile) {
      setActiveCategory(categoryId);
      fetchCategoryCourses(categoryId);
    }
  };

  const handleMobileToggle = (categoryId) => {
    if (activeCategory === categoryId) setActiveCategory(null);
    else {
      setActiveCategory(categoryId);
      fetchCategoryCourses(categoryId);
    }
  };

  // --- Render ---
  return (
    <div className={isMobile ? "w-full" : "relative"}>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`${
          isMobile
            ? "w-full mt-2 space-y-1"
            : "absolute left-0 top-0 w-[700px] bg-white dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-black/50 z-50 flex overflow-hidden origin-top-left ring-1 ring-black/5"
        }`}
      >
        {/* Loading / Error State */}
        {isLoading && !isMobile && (
          <div className="p-8 w-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div>
          </div>
        )}
        {error && !isMobile && (
          <div className="p-8 w-full flex justify-center items-center h-64 text-red-500">
            {error}
          </div>
        )}

        {/* Content Layout */}
        {!isLoading && !error && (
          <>
            {/* Left Side: Categories List */}
            <div
              className={`${
                isMobile
                  ? "w-full"
                  : "w-1/3 border-r border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-3 overflow-y-auto max-h-[400px] custom-scrollbar"
              }`}
            >
              <div className="px-4 py-2 mb-2 hidden md:block">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Domains
                </span>
              </div>

              {categories.map((category) => (
                <div key={category.id}>
                  <div
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onClick={() => isMobile && handleMobileToggle(category.id)}
                    className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeCategory === category.id
                        ? "bg-white dark:bg-[#F47C26]/10 text-[#F47C26] shadow-sm dark:shadow-none"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-lg transition-colors ${
                          activeCategory === category.id
                            ? "text-[#F47C26]"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {getCategoryIcon(category.name)}
                      </span>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    {isMobile && (
                      <FaChevronDown
                        className={`text-xs transition-transform duration-300 ${
                          activeCategory === category.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {!isMobile && activeCategory === category.id && (
                      <FaChevronRight className="text-xs" />
                    )}
                  </div>

                  {/* Mobile Accordion Content */}
                  {isMobile && activeCategory === category.id && (
                    <div className="bg-gray-50 dark:bg-black/20 px-4 py-2 border-l-2 border-[#F47C26] ml-4 my-1 rounded-r-lg">
                      <SubMenuContent
                        category={category}
                        courses={categoryCourses[category.id]}
                        isLoading={isLoadingCourses[category.id]}
                        onItemClick={onItemClick}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* View All Link */}
              <div className="px-4 py-3 mt-2 border-t border-gray-200 dark:border-white/10">
                <Link
                  to="/services"
                  onClick={onItemClick}
                  className="text-sm font-bold text-[#F47C26] hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-2 transition-colors"
                >
                  View All Services <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>

            {/* Right Side: Services Preview (Desktop Only) */}
            {!isMobile && (
              <div className="w-2/3 p-6 bg-white dark:bg-[#0a0f2d] min-h-[400px]">
                {activeCategory ? (
                  <SubMenuContent
                    category={categories.find((c) => c.id === activeCategory)}
                    courses={categoryCourses[activeCategory]}
                    isLoading={isLoadingCourses[activeCategory]}
                    onItemClick={onItemClick}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                      <FaLayerGroup className="text-3xl" />
                    </div>
                    <p className="text-sm font-medium">
                      Hover over a category to explore solutions
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

// --- Sub-component for Dropdown Content ---
const SubMenuContent = ({ category, courses, isLoading, onItemClick }) => {
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-6 text-sm text-gray-500 text-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
        <p className="mb-2">No specific services found in this category.</p>
        <Link
          to="/contact"
          className="text-[#F47C26] font-bold hover:underline"
        >
          Contact us for a custom quote
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
          Top {category.name} Solutions
        </h4>
        <span className="text-xs text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
          {courses.length} Available
        </span>
      </div>

      {/* Diagram: Showing related services for this category */}
      <div className="hidden sm:block opacity-70 mb-4 h-[1px] overflow-hidden"></div>

      <div className="grid grid-cols-1 gap-2">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/course/${course.slug || course._id}`}
            onClick={onItemClick}
            className="group block p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#F47C26] transition-colors line-clamp-1">
                  {course.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 hidden sm:flex items-center gap-2">
                  <span className="flex items-center text-yellow-500">
                    ★ {course.rating?.toFixed(1) || "5.0"}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Best Seller</span>
                </div>
              </div>
              <FaArrowRight className="text-gray-300 dark:text-gray-600 text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10">
        <Link
          to={`/services/category/${
            category.slug || category.name.toLowerCase().replace(/\s+/g, "-")
          }`}
          onClick={onItemClick}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#F47C26] bg-[#F47C26]/10 rounded-lg hover:bg-[#F47C26] hover:text-white transition-all duration-300"
        >
          Explore all {category.name} <FaArrowRight />
        </Link>
      </div>
    </motion.div>
  );
};

export default CourseMenu;
