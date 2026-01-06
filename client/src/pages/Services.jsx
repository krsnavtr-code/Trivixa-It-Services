import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaArrowRight,
  FaTimes,
  FaFilter,
  FaLayerGroup,
  FaStar,
  FaChevronRight,
  FaCheckSquare,
  FaRegSquare,
  FaToggleOn,
  FaToggleOff,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion for smooth drop animation

// API Imports
import { getProjects } from "../api/projectApi";
import { getCategoriesForForm } from "../api/servicesApi";

const Services = () => {
  const { t } = useTranslation();

  // State
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter State (Arrays for Multi-Select)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle State
  const [isCategoryMultiSelect, setIsCategoryMultiSelect] = useState(false);
  const [isSubMultiSelect, setIsSubMultiSelect] = useState(false);

  // Expand State for Subcategories
  const [isSubcategoriesExpanded, setIsSubcategoriesExpanded] = useState(false);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constants
  const VISIBLE_SUBCATEGORY_LIMIT = 5;

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Projects
        const projectsResponse = await getProjects({});

        if (projectsResponse.success && Array.isArray(projectsResponse.data)) {
          const normalizedProjects = projectsResponse.data.map((project) => ({
            ...project,
            category: project.category?._id || project.category,
            subCategories: Array.isArray(project.subCategories)
              ? project.subCategories.map((sub) => ({
                  _id: sub._id || sub,
                  name: sub.name || String(sub).split("-").join(" "),
                }))
              : [],
          }));

          setServices(normalizedProjects);
          setFilteredServices(normalizedProjects);
        } else {
          setServices([]);
          setFilteredServices([]);
        }

        // Fetch Categories
        const categoriesResponse = await getCategoriesForForm();

        if (categoriesResponse && Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = [...services];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (service) =>
          service.title?.toLowerCase().includes(term) ||
          service.description?.toLowerCase().includes(term) ||
          (service.tags &&
            Array.isArray(service.tags) &&
            service.tags.some((tag) =>
              String(tag).toLowerCase().includes(term)
            ))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(
        (service) =>
          selectedCategories.includes(service.category) ||
          (service.category &&
            selectedCategories.includes(service.category._id)) ||
          selectedCategories.includes(service.categoryId)
      );
    }

    if (selectedSubcategories.length > 0) {
      result = result.filter(
        (service) =>
          selectedSubcategories.includes(service.subcategory) ||
          (service.subCategories &&
            Array.isArray(service.subCategories) &&
            service.subCategories.some((sub) =>
              selectedSubcategories.includes(sub._id || sub)
            ))
      );
    }

    setFilteredServices(result);
  }, [services, searchTerm, selectedCategories, selectedSubcategories]);

  // 3. Handlers
  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      return;
    }

    if (isCategoryMultiSelect) {
      setSelectedCategories((prev) => {
        if (prev.includes(categoryId)) {
          return prev.filter((id) => id !== categoryId);
        } else {
          return [...prev, categoryId];
        }
      });
    } else {
      setSelectedCategories((prev) =>
        prev.length === 1 && prev[0] === categoryId ? [] : [categoryId]
      );
      setSelectedSubcategories([]);
    }
  };

  const handleSubcategoryClick = (subId) => {
    if (subId === "all") {
      setSelectedSubcategories([]);
      return;
    }

    if (isSubMultiSelect) {
      setSelectedSubcategories((prev) => {
        if (prev.includes(subId)) {
          return prev.filter((id) => id !== subId);
        } else {
          return [...prev, subId];
        }
      });
    } else {
      setSelectedSubcategories((prev) =>
        prev.length === 1 && prev[0] === subId ? [] : [subId]
      );
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSearchTerm("");
  };

  const currentSubcategories = () => {
    const relevantCategories =
      selectedCategories.length === 0
        ? categories
        : categories.filter(
            (cat) =>
              cat &&
              (selectedCategories.includes(cat._id) ||
                selectedCategories.includes(cat.value))
          );

    return relevantCategories.flatMap((cat) => {
      const subs = cat?.subcategories || [];
      return subs.map((sub) => ({
        _id: sub._id || sub.value,
        name: sub.name || sub.label,
      }));
    });
  };

  // --- Theme Classes ---
  const inputClass =
    "block w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-[#0a0f2d] min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded shadow-sm">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  // Helper for Subcategories Logic
  const allSubs = currentSubcategories();
  const visibleSubs = allSubs.slice(0, VISIBLE_SUBCATEGORY_LIMIT);
  const hiddenSubs = allSubs.slice(VISIBLE_SUBCATEGORY_LIMIT);
  const hasHiddenSubs = hiddenSubs.length > 0;

  return (
    <div className="bg-gray-50 dark:bg-[#0a0f2d] min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F47C26]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-10 mt-6">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white sm:text-6xl tracking-tight mb-4">
            Our <span className="text-[#F47C26]">Services</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Cutting-edge solutions tailored to drive your digital
            transformation.
          </p>
        </div>

        {/* --- Layout: Sidebar + Content --- */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* === SIDEBAR (Categories) === */}
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-6 lg:sticky lg:top-24">
              {/* Header with Multi-Select Toggle */}
              <div className="flex flex-col items-start justify-between mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <FaLayerGroup /> Service Domains
                </h2>
                <button
                  onClick={() =>
                    setIsCategoryMultiSelect(!isCategoryMultiSelect)
                  }
                  className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    isCategoryMultiSelect
                      ? "text-[#F47C26] bg-[#F47C26]/10"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                  title={
                    isCategoryMultiSelect
                      ? "Disable Multi-Select"
                      : "Enable Multi-Select"
                  }
                >
                  {isCategoryMultiSelect ? (
                    <FaToggleOn size={16} className="text-[#F47C26]" />
                  ) : (
                    <FaToggleOff size={16} className="text-gray-400" />
                  )}
                  {isCategoryMultiSelect
                    ? "Disable Multi-Select"
                    : "Enable Multi-Select"}
                </button>
              </div>

              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryClick("all")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold group ${
                      selectedCategories.length === 0
                        ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/30"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <span>All Services</span>
                    {selectedCategories.length === 0 && (
                      <FaChevronRight className="text-xs flex-shrink-0" />
                    )}
                  </button>
                </li>
                {categories.map((category, index) => {
                  if (!category) return null;
                  const categoryId = category.value || category._id;
                  const categoryName =
                    category.label || category.name || `Category ${index + 1}`;
                  if (!categoryId) return null;

                  const isActive = selectedCategories.includes(categoryId);

                  return (
                    <li key={`cat-${categoryId}`}>
                      <button
                        onClick={() => handleCategoryClick(categoryId)}
                        title={categoryName}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold group ${
                          isActive
                            ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/30"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                        }`}
                      >
                        <span className="truncate text-left flex-1">
                          {categoryName}
                        </span>
                        {isCategoryMultiSelect ? (
                          <div
                            className={`text-xs flex-shrink-0 ml-2 ${
                              isActive ? "opacity-100" : "opacity-30"
                            }`}
                          >
                            {isActive ? <FaCheckSquare /> : <FaRegSquare />}
                          </div>
                        ) : (
                          isActive && (
                            <FaChevronRight className="text-xs flex-shrink-0 ml-2" />
                          )
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* === MAIN CONTENT === */}
          <div className="w-full lg:w-3/4">
            {/* Toolbar (Search & Filters) */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-8">
              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Search specific services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Subcategories Header */}
              {allSubs.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center">
                    <FaFilter className="mr-1 text-[#F47C26]" />
                    {selectedCategories.length > 0
                      ? "Specializations"
                      : "All Specializations"}
                  </span>

                  <button
                    onClick={() => setIsSubMultiSelect(!isSubMultiSelect)}
                    className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                      isSubMultiSelect
                        ? "text-[#F47C26] bg-[#F47C26]/10"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    }`}
                  >
                    {isSubMultiSelect ? (
                      <FaToggleOn size={16} />
                    ) : (
                      <FaToggleOff size={16} />
                    )}
                    <span className="hidden sm:inline">Multi-Select</span>
                  </button>
                </div>
              )}

              {/* === SUBCATEGORIES CONTAINER === */}
              {allSubs.length > 0 && (
                <div className="mb-4">
                  {/* 1. Visible Chips (First 5 + "All") */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSubcategoryClick("all")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        selectedSubcategories.length === 0
                          ? "bg-[#F47C26]/10 border-[#F47C26] text-[#F47C26]"
                          : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#F47C26]"
                      }`}
                    >
                      All
                    </button>
                    {visibleSubs.map((sub) => {
                      const isActive = selectedSubcategories.includes(sub._id);
                      return (
                        <button
                          key={`sub-${sub._id}`}
                          onClick={() => handleSubcategoryClick(sub._id)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                            isActive
                              ? "bg-[#F47C26]/10 border-[#F47C26] text-[#F47C26]"
                              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#F47C26]"
                          }`}
                        >
                          {isSubMultiSelect && isActive && (
                            <FaCheckSquare size={10} />
                          )}
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* 2. Expandable Drop Container (Remaining items) */}
                  <AnimatePresence>
                    {isSubcategoriesExpanded && hasHiddenSubs && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-white/5 border-dashed">
                          {hiddenSubs.map((sub) => {
                            const isActive = selectedSubcategories.includes(
                              sub._id
                            );
                            return (
                              <button
                                key={`sub-hidden-${sub._id}`}
                                onClick={() => handleSubcategoryClick(sub._id)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                                  isActive
                                    ? "bg-[#F47C26]/10 border-[#F47C26] text-[#F47C26]"
                                    : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#F47C26]"
                                }`}
                              >
                                {isSubMultiSelect && isActive && (
                                  <FaCheckSquare size={10} />
                                )}
                                {sub.name}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 3. Show More / Less Toggle Button */}
                  {hasHiddenSubs && (
                    <button
                      onClick={() =>
                        setIsSubcategoriesExpanded(!isSubcategoriesExpanded)
                      }
                      className="mt-3 text-xs font-bold text-[#F47C26] hover:text-[#d5671f] flex items-center gap-1 transition-colors"
                    >
                      {isSubcategoriesExpanded ? (
                        <>
                          Show Less <FaChevronUp size={10} />
                        </>
                      ) : (
                        <>
                          Show {hiddenSubs.length} More{" "}
                          <FaChevronDown size={10} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Active Tags Display */}
              {(selectedCategories.length > 0 ||
                selectedSubcategories.length > 0 ||
                searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-white/10">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                    Active Filters:
                  </span>

                  {selectedCategories.map((catId) => {
                    const cat = categories.find(
                      (c) => c._id === catId || c.value === catId
                    );
                    if (!cat) return null;
                    return (
                      <span
                        key={catId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30"
                      >
                        {cat.name || cat.label}
                        <button
                          onClick={() => handleCategoryClick(catId)}
                          className="ml-2 hover:text-blue-600"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    );
                  })}

                  {selectedSubcategories.map((subId) => {
                    const sub = allSubs.find((s) => s._id === subId);
                    const subName = sub?.name || "Subcategory";
                    return (
                      <span
                        key={subId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-500/30"
                      >
                        {subName}
                        <button
                          onClick={() => handleSubcategoryClick(subId)}
                          className="ml-2 hover:text-green-600"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    );
                  })}

                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30">
                      "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-2 hover:text-yellow-600"
                      >
                        <FaTimes />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-[#F47C26] underline ml-auto"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service._id}
                    className="group flex flex-col bg-white dark:bg-white/5 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-[#F47C26]/50 dark:hover:border-[#F47C26]/50 hover:-translate-y-2 overflow-hidden h-full"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-[#0a0f2d]">
                      {service.thumbnail ? (
                        <img
                          src={service.thumbnail}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-white/20">
                          <FaLayerGroup size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2d] via-transparent to-transparent opacity-60"></div>
                      {service.isFeatured && (
                        <span className="absolute top-4 right-4 bg-[#F47C26] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                          <FaStar /> Featured
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                          {categories.find((c) => c._id === service.category)
                            ?.name || "Service"}
                        </span>
                        {service.price ? (
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            ${service.price}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            Free
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#F47C26] transition-colors line-clamp-1">
                        {service.title}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                        {service.shortDescription ||
                          service.description?.substring(0, 120) + "..."}
                      </p>

                      <Link
                        to={`/services/${service.slug || service._id}`}
                        className="mt-auto flex items-center justify-center w-full px-4 py-3 border border-[#F47C26] text-[#F47C26] rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#F47C26] hover:text-white transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/30"
                      >
                        View Details{" "}
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                <div className="mx-auto h-24 w-24 text-gray-300 dark:text-white/20 mb-4">
                  <FaSearch className="w-full h-full opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  No services found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  We couldn't find any services matching your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-[#F47C26] hover:bg-[#d5671f] transition-all shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
