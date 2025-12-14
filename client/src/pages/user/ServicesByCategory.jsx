import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { getServicesByCategory } from "../../api/servicesApi";
import { getCategories } from "../../api/categoryApi";
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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCategories({ limit: 100 });
        const categoriesData = response.data || [];
        setAllCategories(categoriesData);
        setCategory(null);

        if (categoryName) {
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

        const allCoursesResponse = await getServicesByCategory();
        const allCourses = Array.isArray(allCoursesResponse)
          ? allCoursesResponse
          : allCoursesResponse.data || [];
        setCourses(allCourses);
        setCategory(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  if (loading) {
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
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* --- Sidebar: Categories Menu --- */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                Service Domains
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/services"
                    onClick={() => {
                      setCategory(null);
                      setCourses([]);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${
                      !categoryName
                        ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/30"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#F47C26] dark:hover:text-white"
                    }`}
                  >
                    <span className="text-lg opacity-80">
                      <FaLayerGroup />
                    </span>
                    All Services
                  </Link>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/services/category/${cat.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${
                        category?._id === cat._id
                          ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/30"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#F47C26] dark:hover:text-white"
                      }`}
                    >
                      <span className="text-lg opacity-80">
                        {getCategoryIcon(cat.name)}
                      </span>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- Main Content: Service Grid --- */}
          <div className="w-full lg:w-3/4">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-gray-200 dark:border-white/10">
              <div>
                <span className="text-[#F47C26] font-bold text-xs uppercase tracking-widest mb-2 block">
                  {category ? "Specialized Domain" : "Complete Portfolio"}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                  {category ? category.name : "All Solutions"}
                </h1>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {courses.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Available Services
                </p>
              </div>
            </div>

            {/* Grid */}
            <AnimatePresence>
              {courses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10"
                >
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <FaCode className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    No Services Found
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-md text-center">
                    We are currently updating our portfolio for this category.
                    Check back soon or contact us for custom requests.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
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

// --- Modern Service Card Component ---
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
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

          {/* Floating Badge */}
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
