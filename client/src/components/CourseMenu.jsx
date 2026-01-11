import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import { getProjects } from "../api/projectApi";
import {
  FaChevronDown,
  FaChevronRight,
  FaLayerGroup,
  FaArrowRight,
  FaCode,
  FaFolderOpen,
  FaGlobe,
  FaTools,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CourseMenu = ({ isMobile = false, onItemClick = () => {} }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryProjects, setCategoryProjects] = useState({});
  const [isLoadingProjects, setIsLoadingProjects] = useState({});

  // --- Fetch Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Ensure you have a getCategories function in your API
        const response = await getCategories({
          limit: 22,
          fields: "_id,name,slug,courseCount,isActive",
          sort: "name",
        });

        let categoriesData = [];
        if (Array.isArray(response)) categoriesData = response;
        else if (response?.data && Array.isArray(response.data))
          categoriesData = response.data;
        else if (response?.docs && Array.isArray(response.docs))
          categoriesData = response.docs;

        const processedCategories = categoriesData
          .filter((cat) => cat && cat._id && cat.name)
          .map((category) => ({
            id: category._id,
            name: category.name,
            slug: category.slug || category._id,
            courseCount: category.courseCount || category.courses,
          }));

        setCategories(processedCategories);

        if (!isMobile && processedCategories.length > 0) {
          setActiveCategory(processedCategories[0].id);
          fetchCategoryProjects(processedCategories[0].id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load services.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isMobile]);

  // --- Fetch Projects for Category ---
  const fetchCategoryProjects = useCallback(
    async (categoryId) => {
      if (
        !categoryId ||
        categoryProjects[categoryId] ||
        isLoadingProjects[categoryId]
      ) {
        return;
      }

      try {
        setIsLoadingProjects((prev) => ({ ...prev, [categoryId]: true }));
        const response = await getProjects({
          category: categoryId,
          limit: 6, // Limit for preview
          sort: "-createdAt",
        });

        let projects = [];
        if (Array.isArray(response)) projects = response;
        else if (response?.data) projects = response.data;
        else if (response?.docs) projects = response.docs;

        // Map project data to match the expected format
        const formattedProjects = projects.map((project) => ({
          ...project,
          id: project._id,
          name: project.title,
          description: project.shortDescription,
          technologies: project.techStack?.map((tech) => tech.name) || [],
          status: project.projectStatus,
        }));

        setCategoryProjects((prev) => ({
          ...prev,
          [categoryId]: formattedProjects,
        }));
      } catch (err) {
        console.error(
          `Error fetching projects for category ${categoryId}:`,
          err
        );
      } finally {
        setIsLoadingProjects((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [categoryProjects, isLoadingProjects]
  );

  // --- Handlers ---
  const handleMouseEnter = (categoryId) => {
    if (!isMobile) {
      setActiveCategory(categoryId);
      fetchCategoryProjects(categoryId);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (isMobile) {
      setActiveCategory(activeCategory === categoryId ? null : categoryId);
      if (activeCategory !== categoryId) {
        fetchCategoryProjects(categoryId);
      }
    }
  };

  // --- Mobile View ---
  if (isMobile) {
    return (
      <div className="w-full space-y-1">
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#F47C26]"></div>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="border-b border-gray-100 dark:border-white/5 last:border-0"
            >
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full flex items-center justify-between px-2 py-3 text-left transition-colors ${
                  activeCategory === category.id
                    ? "text-[#F47C26] font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>{category.name}</span>
                <FaChevronDown
                  className={`text-xs transition-transform duration-300 ${
                    activeCategory === category.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pb-4">
                      <SubMenuContent
                        category={category}
                        projects={categoryProjects[category.id]}
                        isLoading={isLoadingProjects[category.id]}
                        onItemClick={onItemClick}
                        isMobile={true}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/10">
          <Link
            to="/services"
            onClick={onItemClick}
            className="flex items-center gap-2 text-[#F47C26] font-bold text-sm"
          >
            View All Services <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  // --- Desktop View ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-full mt-0 w-[850px] bg-white dark:bg-[#0a0f2d]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-[9999] flex overflow-hidden ring-1 ring-black/5"
      style={{ transformOrigin: "top left" }}
    >
      {/* Left Sidebar: Categories */}
      <div className="w-[280px] bg-gray-50/50 dark:bg-black/20 border-r border-gray-200 dark:border-white/5 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <FaLayerGroup /> Categories
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar max-h-[450px]">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#F47C26]"></div>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                onMouseEnter={() => handleMouseEnter(category.id)}
                className={`group flex items-center justify-between px-5 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${
                  activeCategory === category.id
                    ? "bg-white dark:bg-[#F47C26] text-[#F47C26] dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="text-sm font-medium truncate">
                  {category.name}
                </span>
                {activeCategory === category.id && (
                  <FaChevronRight className="text-xs opacity-80" />
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-transparent">
          <Link
            to="/services"
            onClick={onItemClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#F47C26] hover:border-[#F47C26] dark:hover:border-[#F47C26] transition-all"
          >
            All Services <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Right Content: Projects Preview */}
      <div className="flex-1 bg-white dark:bg-transparent p-6 min-h-[450px] flex flex-col">
        {activeCategory ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#F47C26] rounded-full"></span>
                {categories.find((c) => c.id === activeCategory)?.name}
              </h2>
              <Link
                to={`/services/category/${
                  categories.find((c) => c.id === activeCategory)?.slug
                }`}
                onClick={onItemClick}
                className="text-xs font-bold text-[#F47C26] hover:underline flex items-center gap-1"
              >
                View Category <FaArrowRight />
              </Link>
            </div>

            <div className="flex-1">
              <SubMenuContent
                category={categories.find((c) => c.id === activeCategory)}
                projects={categoryProjects[activeCategory]}
                isLoading={isLoadingProjects[activeCategory]}
                onItemClick={onItemClick}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
            <FaLayerGroup size={48} className="mb-4" />
            <p>Select a category to view projects</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Sub-component for Content ---
const SubMenuContent = ({
  category,
  projects,
  isLoading,
  onItemClick,
  isMobile,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-2xl">
        <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-3 text-gray-400">
          <FaFolderOpen />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          No projects found
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Check back later for updates
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid ${isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"}`}
    >
      {projects.map((project) => (
        <Link
          key={project._id}
          to={`/services/${project.slug || project._id}`}
          onClick={onItemClick}
          className="group block p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-[#0a0f2d] border border-transparent hover:border-gray-200 dark:hover:border-[#F47C26]/30 hover:shadow-lg dark:hover:shadow-[#F47C26]/10 transition-all duration-300 relative overflow-hidden"
        >
          {/* Hover Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#F47C26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative z-10">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors line-clamp-1 mb-1.5 flex items-center justify-between">
              {project.title}
              <FaArrowRight className="text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#F47C26]" />
            </h4>

            {project.shortDescription && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                {project.shortDescription}
              </p>
            )}

            {/* Tech Stack Pills */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                  >
                    <FaCode className="mr-1 text-[8px] text-[#F47C26]" /> {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-[10px] text-gray-400 self-center pl-1">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CourseMenu;
