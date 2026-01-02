import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../components/SEO";
import {
  getServicesByCategory,
  getServicesBySubCategory,
} from "../../api/servicesApi";
import { getCategories, getSubCategories } from "../../api/categoryApi";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";
import {
  FaStar,
  FaClock,
  FaArrowRight,
  FaCode,
  FaServer,
  FaBrain,
  FaShieldAlt,
  FaMobile,
  FaPaintBrush,
  FaLayerGroup,
  FaCheck,
  FaFilter,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper: Hide Scrollbar CSS ---
// Add this to your global CSS or keep it here for simplicity
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
      display: none;
  }
  .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
`;

// Helper to get icon for a service category
const getCategoryIcon = (name) => {
  const n = name?.toLowerCase() || "";
  if (n.includes("web")) return <FaCode />;
  if (n.includes("cloud") || n.includes("server")) return <FaServer />;
  if (n.includes("ai") || n.includes("data")) return <FaBrain />;
  if (n.includes("security") || n.includes("cyber")) return <FaShieldAlt />;
  if (n.includes("mobile")) return <FaMobile />;
  if (n.includes("design") || n.includes("ui")) return <FaPaintBrush />;
  return <FaLayerGroup />; // Default
};

const ServicesByCategory = () => {
  const { categoryName } = useParams();
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const activeCategoryRef = useRef(null);
  const sidebarRef = useRef(null);

  // Scroll to active category when it changes
  useEffect(() => {
    if (activeCategoryRef.current && sidebarRef.current) {
      // Calculate the position to scroll to
      const sidebar = sidebarRef.current;
      const activeItem = activeCategoryRef.current;
      
      // Scroll the sidebar to position the active item at the top
      sidebar.scrollTo({
        top: activeItem.offsetTop - 24, // 24px offset from top
        behavior: 'smooth'
      });
    }
  }, [category?._id]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!category?._id) {
        setSubCategories([]);
        setSelectedSubCategory(null);
        return;
      }

      try {
        const response = await getSubCategories({
          categoryId: category._id,
          limit: 100,
          isActive: true,
          fields: "_id,name,slug",
          sort: "name",
        });
        setSubCategories(
          Array.isArray(response) ? response : response?.data || []
        );
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories");
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [category]);

  // Fetch services based on category and subcategory
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSelectedSubCategory(null);

        // First, get all categories for the sidebar
        const categoriesResponse = await getCategories({ limit: 100 });
        const categoriesData = categoriesResponse.data || [];
        setAllCategories(categoriesData);
        setCategory(null);

        if (categoryName) {
          // Find the selected category
          let categoryData = categoriesData.find(
            (cat) => cat?.slug?.toLowerCase() === categoryName.toLowerCase()
          );

          if (!categoryData) {
            categoryData = categoriesData.find(
              (cat) =>
                cat?.name?.toLowerCase().replace(/\s+/g, "-") ===
                categoryName.toLowerCase()
            );
          }

          if (categoryData) {
            setCategory(categoryData);

            // Fetch services for this category
            const coursesResponse = await getServicesByCategory(
              categoryData._id
            );
            const coursesData = Array.isArray(coursesResponse)
              ? coursesResponse
              : coursesResponse.data || [];
            setCourses(coursesData);
            return;
          }
        }

        // If no specific category or subcategory, fetch all services
        const allCoursesResponse = await getServicesByCategory();
        const allCourses = Array.isArray(allCoursesResponse)
          ? allCoursesResponse
          : allCoursesResponse.data || [];
        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  // Handle subcategory selection
  const handleSubCategorySelect = async (subCategory) => {
    try {
      setLoading(true);

      // Toggle logic: If clicking the active one, deselect it (show all)
      const isDeselecting =
        subCategory === null ||
        (selectedSubCategory && subCategory._id === selectedSubCategory);
      const newSelectionId = isDeselecting ? null : subCategory._id;

      setSelectedSubCategory(newSelectionId);

      if (isDeselecting) {
        // Show all services in the category
        const response = await getServicesByCategory(category._id);
        const coursesData = Array.isArray(response)
          ? response
          : response?.data || [];
        setCourses(coursesData);
      } else {
        // Show services for the selected subcategory
        const response = await getServicesBySubCategory(subCategory._id);
        const coursesData = Array.isArray(response)
          ? response
          : response?.data || [];
        setCourses(coursesData);
      }
    } catch (error) {
      console.error("Error filtering by subcategory:", error);
      toast.error("Failed to filter services");
    } finally {
      setLoading(false);
    }
  };

  if (loading && allCategories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  const formattedCategoryName = categoryName
    ? categoryName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Services";

  const seoTitle = `${formattedCategoryName} Services | Trivixa IT Solutions`;
  const seoDescription = `Explore our ${formattedCategoryName} services. We deliver cutting-edge IT solutions to drive your business forward.`;
  const canonicalUrl = `https://trivixa.com/services/category/${categoryName}`;

  return (
    <div className="min-h-screen mt-10 bg-gray-50 dark:bg-[#0a0f2d] relative overflow-hidden transition-colors duration-500">
      <style>{scrollbarHideStyles}</style>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${formattedCategoryName}, IT services, software development, Trivixa services`}
        canonical={canonicalUrl}
        og={{
          title: seoTitle,
          description: seoDescription,
          type: "website",
          url: canonicalUrl,
        }}
      />

      {/* --- Sci-Fi Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* --- Sidebar: Main Categories Menu --- */}
          <div className="w-full lg:w-1/4">
            <div 
              ref={sidebarRef}
              className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-6 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pb-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                <FaLayerGroup /> Service Domains
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/services"
                    onClick={() => {
                      setCategory(null);
                      setSelectedSubCategory(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold group ${
                      !categoryName
                        ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/30"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`text-lg transition-transform group-hover:scale-110 ${
                        !categoryName ? "opacity-100" : "opacity-70"
                      }`}
                    >
                      <FaLayerGroup />
                    </span>
                    All Services
                  </Link>
                </li>
                {allCategories.map((cat) => (
                  <li
                    key={cat._id}
                    ref={category?._id === cat._id ? activeCategoryRef : null}
                    className="scroll-mt-4"
                  >
                    <Link
                      to={`/services/category/${
                        cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")
                      }`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold group ${
                        category?._id === cat._id
                          ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/30"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`text-lg transition-transform group-hover:scale-110 ${
                          category?._id === cat._id
                            ? "opacity-100"
                            : "opacity-70"
                        }`}
                      >
                        {getCategoryIcon(cat.name)}
                      </span>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- Main Content --- */}
          <div className="w-full lg:w-3/4">
            {/* Header Area */}
            <div className="mb-8">
              <span className="text-[#F47C26] font-bold text-xs uppercase tracking-widest mb-2 block">
                {selectedSubCategory
                  ? subCategories.find((sc) => sc._id === selectedSubCategory)
                      ?.name
                  : category
                  ? category.name
                  : "Complete Portfolio"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                {selectedSubCategory
                  ? `${
                      subCategories.find((sc) => sc._id === selectedSubCategory)
                        ?.name
                    } Solutions`
                  : category
                  ? `${category.name} `
                  : "All Solutions"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {courses.length} {courses.length === 1 ? "Service" : "Services"}{" "}
                Available
              </p>
            </div>

            {/* --- MODERN SUBCATEGORY SLIDER --- */}
            {category && subCategories.length > 0 && (
              <div className="sticky top-[70px] z-30 -mx-6 px-6 lg:mx-0 lg:px-0 mb-10">
                {/* Glassmorphism Background Container */}
                <div className="relative">
                  {/* Fade gradients to indicate scrolling */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 dark:from-[#0a0f2d] to-transparent z-10 pointer-events-none lg:hidden"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-[#0a0f2d] to-transparent z-10 pointer-events-none lg:hidden"></div>

                  <div className="overflow-x-auto scrollbar-hide py-2 flex items-center gap-3">
                    {/* "All" Filter Pill */}
                    <button
                      onClick={() => handleSubCategorySelect(null)}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                        !selectedSubCategory
                          ? "bg-[#0B2545] dark:bg-white text-white dark:text-[#0B2545] border-[#0B2545] dark:border-white shadow-lg transform scale-105"
                          : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-[#F47C26] hover:text-[#F47C26]"
                      }`}
                    >
                      <FaFilter className="text-xs" />
                      All {category.name}
                    </button>

                    {/* Subcategory Pills */}
                    {subCategories.map((subCat) => {
                      const isActive = selectedSubCategory === subCat._id;
                      return (
                        <button
                          key={subCat._id}
                          onClick={() => handleSubCategorySelect(subCat)}
                          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                            isActive
                              ? "bg-[#F47C26] text-white border-[#F47C26] shadow-lg shadow-orange-500/20 transform scale-105"
                              : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-[#F47C26] hover:text-[#F47C26] dark:hover:bg-white/10"
                          }`}
                        >
                          {isActive && <FaCheck className="text-xs" />}
                          {subCat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* --- Service Grid --- */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
                </div>
              ) : courses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 backdrop-blur-sm"
                >
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <FaCode className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    No Services Found
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-md text-center text-sm">
                    We are currently updating our portfolio for this specific
                    category. Check back soon or contact us for custom requests.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key={selectedSubCategory || "all"} // Trigger animation on filter change
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {courses.map((course) => (
                    <ServiceCard key={course._id} course={course} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Modern Service Card Component (Unchanged) ---
const ServiceCard = ({ course }) => {
  const [imageState, setImageState] = useState({
    url: "",
    isLoading: true,
    hasError: false,
  });

  useEffect(() => {
    let isMounted = true;
    const loadImage = async () => {
      if (!course.thumbnail) {
        if (isMounted)
          setImageState({
            url: "/images/service-placeholder.jpg",
            isLoading: false,
            hasError: true,
          });
        return;
      }
      try {
        const url = getImageUrl(course.thumbnail);
        const img = new Image();
        img.src = url;
        img.onload = () =>
          isMounted &&
          setImageState({ url, isLoading: false, hasError: false });
        img.onerror = () =>
          isMounted &&
          setImageState({
            url: "/images/service-placeholder.jpg",
            isLoading: false,
            hasError: true,
          });
      } catch (e) {
        if (isMounted)
          setImageState({
            url: "/images/service-placeholder.jpg",
            isLoading: false,
            hasError: true,
          });
      }
    };
    loadImage();
    return () => {
      isMounted = false;
    };
  }, [course.thumbnail]);

  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <Link
        to={`/service/${course.slug || course._id}`}
        className="flex flex-col h-full"
      >
        {/* Image Area */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
          {imageState.isLoading ? (
            <div className="w-full h-full animate-pulse bg-gray-200 dark:bg-white/5" />
          ) : (
            <img
              src={imageState.url}
              alt={course.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          {course.isFeatured && (
            <div className="absolute top-3 right-3 bg-[#F47C26] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wide">
              Featured
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#F47C26] transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />{" "}
              {course.rating?.toFixed(1) || "5.0"}
            </div>
            <div className="flex items-center gap-1">
              <FaClock /> {course.duration || "Flexible"}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
            {course.shortDescription
              ? course.shortDescription.replace(/<[^>]*>?/gm, "")
              : "Leverage our expertise to build scalable solutions aimed at driving growth and efficiency."}
          </p>

          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between mt-auto">
            <span className="text-xs font-bold text-[#F47C26] uppercase tracking-wider group-hover:underline">
              View Details
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#F47C26] group-hover:text-white transition-all duration-300">
              <FaArrowRight className="text-xs" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServicesByCategory;
