import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryCourses, setCategoryCourses] = useState({});
  const [isLoadingCourses, setIsLoadingCourses] = useState({});
  const menuRef = useRef(null);

  // Animation Variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
  };

  // Fetch categories logic (kept intact but cleaned up)
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
          // Fallback attempt
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
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load services.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch courses for a category
  const fetchCategoryCourses = useCallback(
    async (categoryId) => {
      if (!categoryId || categoryCourses[categoryId]) return; // Avoid refetching

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

  // Click Outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div
      className={`hover-underline  relative ${
        isMobile ? "w-full" : "inline-block"
      }`}
      ref={menuRef}
    >
      {/* Trigger Button */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            isOpen ? "text-[#F47C26] bg-white/5" : "text-black dark:text-white"
          }`}
        >
          Services{" "}
          <FaChevronDown
            className={`text-xs transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Dropdown Container */}
      <AnimatePresence>
        {(isOpen || isMobile) && (
          <motion.div
            variants={!isMobile ? dropdownVariants : {}}
            initial={!isMobile ? "hidden" : false}
            animate={!isMobile ? "visible" : false}
            exit={!isMobile ? "exit" : false}
            className={`${
              isMobile
                ? "w-full mt-2 space-y-1"
                : "absolute left-0 mt-2 w-[600px] bg-[#0a0f2d] border border-white/10 rounded-xl shadow-2xl z-50 flex overflow-hidden origin-top-left"
            }`}
          >
            {/* Loading / Error State */}
            {isLoading && !isMobile && (
              <div className="p-8 w-full flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div>
              </div>
            )}
            {error && !isMobile && (
              <div className="p-4 text-red-400 text-sm">{error}</div>
            )}

            {/* Content Layout (Desktop: Split View, Mobile: Accordion) */}
            {!isLoading && !error && (
              <>
                {/* Left Side: Categories List */}
                <div
                  className={`${
                    isMobile
                      ? "w-full"
                      : "w-1/3 border-r border-white/10 bg-white/5 py-2"
                  }`}
                >
                  {categories.map((category) => (
                    <div key={category.id}>
                      <div
                        onMouseEnter={() => handleMouseEnter(category.id)}
                        onClick={() =>
                          isMobile && handleMobileToggle(category.id)
                        }
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                          activeCategory === category.id
                            ? "bg-[#F47C26]/10 text-[#F47C26]"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-lg ${
                              activeCategory === category.id
                                ? "text-[#F47C26]"
                                : "text-gray-500"
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
                            className={`text-xs transition-transform ${
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
                        <div className="bg-black/20 px-4 py-2 border-l-2 border-[#F47C26] ml-4 my-1">
                          <SubMenuContent
                            category={category}
                            courses={categoryCourses[category.id]}
                            isLoading={isLoadingCourses[category.id]}
                            onItemClick={() => {
                              setIsOpen(false);
                              onItemClick();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* View All Link */}
                  <div className="px-4 py-3 mt-2 border-t border-white/10">
                    <Link
                      to="/services"
                      onClick={() => {
                        setIsOpen(false);
                        onItemClick();
                      }}
                      className="text-sm font-bold text-[#F47C26] hover:underline flex items-center gap-2"
                    >
                      View All Services <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>

                {/* Right Side: Courses/Services Preview (Desktop Only) */}
                {!isMobile && (
                  <div className="w-2/3 p-4 bg-[#0a0f2d]">
                    {activeCategory ? (
                      <SubMenuContent
                        category={categories.find(
                          (c) => c.id === activeCategory
                        )}
                        courses={categoryCourses[activeCategory]}
                        isLoading={isLoadingCourses[activeCategory]}
                        onItemClick={() => {
                          setIsOpen(false);
                          onItemClick();
                        }}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                        <FaLayerGroup className="text-4xl mb-2" />
                        <p className="text-sm">
                          Hover over a category to see services
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-component for Dropdown Content ---
const SubMenuContent = ({ category, courses, isLoading, onItemClick }) => {
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No specific services found.{" "}
        <Link to="/contact" className="text-[#F47C26] hover:underline">
          Contact us
        </Link>{" "}
        for a custom quote.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2 hidden sm:block">
        Top {category.name} Solutions
      </h4>
      {courses.map((course) => (
        <Link
          key={course._id}
          to={`/course/${course.slug || course._id}`}
          onClick={onItemClick}
          className="block group px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-200 group-hover:text-[#F47C26] transition-colors line-clamp-1">
                {course.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                Rated {course.rating?.toFixed(1) || "5.0"} ★
              </div>
            </div>
            {/* <span className="text-xs font-bold text-gray-400 group-hover:text-white">
               {course.price > 0 ? "₹" + course.price : "Consult"}
            </span> */}
          </div>
        </Link>
      ))}
      <Link
        to={`/services/category/${
          category.slug || category.name.toLowerCase().replace(/\s+/g, "-")
        }`}
        onClick={onItemClick}
        className="block mt-3 px-3 text-xs font-bold text-[#F47C26] hover:underline flex items-center gap-1"
      >
        View all in {category.name} <FaArrowRight />
      </Link>
    </div>
  );
};

export default CourseMenu;
