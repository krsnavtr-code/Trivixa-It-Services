import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { getCoursesByCategory } from "../../api/courseApi";
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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Helper to get icon for a service category
const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("web")) return <FaCode />;
  if (n.includes("cloud") || n.includes("server")) return <FaServer />;
  if (n.includes("ai") || n.includes("data")) return <FaBrain />;
  if (n.includes("security")) return <FaShieldAlt />;
  if (n.includes("mobile")) return <FaMobile />;
  if (n.includes("design") || n.includes("ui/ux")) return <FaPaintBrush />;
  return <FaCode />; // Default
};

const CoursesByCategory = () => {
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
    visible: { opacity: 1, y: 0 },
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

          if (!categoryData) {
            const decodedCategoryName = decodeURIComponent(
              categoryName.replace(/-/g, " ")
            );
            categoryData = categoriesData.find(
              (cat) =>
                cat?.name?.trim().toLowerCase() ===
                decodedCategoryName.trim().toLowerCase()
            );
          }

          if (categoryData) {
            setCategory(categoryData);
            const coursesResponse = await getCoursesByCategory(
              categoryData._id
            );
            const coursesData = Array.isArray(coursesResponse)
              ? coursesResponse
              : coursesResponse.data || [];
            setCourses(coursesData);
            return;
          }
        }

        const allCoursesResponse = await getCoursesByCategory();
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
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f2d]">
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
    <div className="min-h-screen bg-[#0a0f2d] text-white relative overflow-hidden">
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

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none fixed"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F47C26]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 py-8 px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-[#F47C26]">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link
                to="/services"
                className="text-gray-400 hover:text-[#F47C26]"
              >
                Services
              </Link>
            </li>
            {category && (
              <>
                <li className="text-gray-500">/</li>
                <li className="text-[#F47C26] font-medium" aria-current="page">
                  {category.name}
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar with Service Categories */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                Our Expertise
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/services"
                    onClick={() => {
                      setCategory(null);
                      setCourses([]);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      !categoryName
                        ? "bg-[#F47C26]/20 text-[#F47C26] font-medium border border-[#F47C26]/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <span className="text-lg">
                      <FaCode />
                    </span>{" "}
                    All Services
                  </Link>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/services/category/${cat.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        category?._id === cat._id
                          ? "bg-[#F47C26]/20 text-[#F47C26] font-medium border border-[#F47C26]/30"
                          : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <span className="text-lg">
                        {getCategoryIcon(cat.name)}
                      </span>{" "}
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-white/10">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F47C26] text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  {category ? "Service Category" : "Portfolio"}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                  {category ? category.name : "All Services"}
                </h1>
              </div>
              <p className="text-gray-400 mt-4 sm:mt-0">
                {courses.length} Service Offerings
              </p>
            </div>

            <AnimatePresence>
              {courses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white/5 rounded-3xl border border-white/10"
                >
                  <FaCode className="text-5xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-300 text-xl font-medium">
                    No services found in this category yet.
                  </p>
                  <p className="text-gray-500 mt-2">
                    Contact us for a custom solution.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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

const ServiceCard = ({ course }) => {
  // ... (Image loading logic remains same, just styling updated below) ...
  // ... [Your existing imageState & useEffect code] ...
  const [imageState, setImageState] = useState({
    url: "",
    isLoading: true,
    hasError: false,
  });

  useEffect(() => {
    let isMounted = true;
    let img = null;

    const loadImage = async () => {
      if (!course.thumbnail) {
        if (isMounted) {
          setImageState({
            url: "/images/service-placeholder.jpg", // Changed placeholder name
            isLoading: false,
            hasError: true,
          });
        }
        return;
      }

      try {
        const url = getImageUrl(course.thumbnail);
        if (isMounted) setImageState({ url, isLoading: true, hasError: false });

        img = new Image();
        img.onload = () => {
          if (isMounted)
            setImageState({ url, isLoading: false, hasError: false });
        };
        img.onerror = () => {
          if (isMounted)
            setImageState({
              url: "/images/service-placeholder.jpg",
              isLoading: false,
              hasError: true,
            });
        };
        img.src = url;
      } catch (error) {
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
      if (img) img.onload = img.onerror = null;
    };
  }, [course.thumbnail]);

  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 flex flex-col"
    >
      <Link
        to={`/service/${course.slug || course._id}`}
        className="flex flex-col h-full"
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-[#05081a]">
          {imageState.isLoading ? (
            <div className="w-full h-full animate-pulse bg-white/5"></div>
          ) : (
            <img
              src={imageState.url}
              alt={course.title || "Service image"}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "/images/service-placeholder.jpg";
              }} // Fallback
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2d] via-transparent to-transparent opacity-60"></div>

          {course.isFeatured && (
            <div className="absolute top-3 right-3 bg-[#F47C26]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-[#F47C26]/20">
              FEATURED SOLUTION
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[#F47C26] transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center text-sm text-gray-400 mb-4">
            <span className="flex items-center mr-4 gap-1.5">
              <FaStar className="text-yellow-500" />
              <span className="font-semibold text-gray-300">
                {course.rating?.toFixed(1) || "5.0"}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <FaClock className="text-gray-500" />
              <span>{course.duration || "Flexible"} Timeline</span>
            </span>
          </div>

          <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow">
            {course.shortDescription
              ? course.shortDescription.replace(/<[^>]*>?/gm, "")
              : "Leverage our expertise to build scalable solutions aimed at driving growth and efficiency for your business."}
          </p>

          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-[#F47C26] text-xs font-bold uppercase tracking-wide group-hover:underline">
              View Details
            </span>
            <FaArrowRight className="text-[#F47C26] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CoursesByCategory;
