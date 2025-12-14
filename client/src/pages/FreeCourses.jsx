import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import axios from "axios";
import {
  FaSearch,
  FaStar,
  FaClock,
  FaBookOpen,
  FaCode,
  FaArrowRight,
  FaGraduationCap,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FreeCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

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
    const fetchCategoryCourses = async () => {
      try {
        setLoading(true);
        // Using the specific category ID provided in your original code
        const categoryId = "68887f978b23a2d739ac5be4";

        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/services?category=${categoryId}&isPublished=true`
        );

        const coursesData = Array.isArray(response.data) ? response.data : [];

        // Sort: Free first, then by title
        const sortedCourses = [...coursesData].sort((a, b) => {
          if ((a.price === 0 || a.isFree) && b.price > 0 && !b.isFree)
            return -1;
          if ((b.price === 0 || b.isFree) && a.price > 0 && !a.isFree) return 1;
          return a.title.localeCompare(b.title);
        });

        setCourses(sortedCourses);
        setFilteredCourses(sortedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCourses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (course.instructor &&
            course.instructor
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (course.category &&
            course.category.name &&
            course.category.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] relative overflow-hidden transition-colors duration-300">
      <SEO
        title="Open Resources | Trivixa IT Solutions"
        description="Access high-quality free technical resources and courses. Learn modern development skills with Trivixa's open learning initiative."
        keywords="free coding courses, react tutorials, free IT training, open source learning"
      />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none fixed"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-400/10 dark:bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
              Community Access
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Unlock Knowledge for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500">
                Free
              </span>
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Empowering the developer community with high-quality, accessible
              learning resources. No credit card required.
            </p>

            {/* Search Bar */}
            <div className="mt-10 relative max-w-lg mx-auto">
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 text-gray-900 dark:bg-white/5 dark:border-white/10 dark:text-white rounded-2xl shadow-lg dark:shadow-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                placeholder="Search tutorials, guides, and courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-white dark:bg-white/5 rounded-2xl animate-pulse border border-gray-200 dark:border-white/5 shadow-sm"
                ></div>
              ))}
            </div>
          )}

          {/* Courses Grid */}
          {!loading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <motion.div
                      key={course._id}
                      variants={itemVariants}
                      className="group relative bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-green-300 dark:hover:border-green-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/5 dark:hover:shadow-black/50 flex flex-col"
                    >
                      <Link
                        to={`/course/${course._id}`}
                        className="flex flex-col h-full"
                      >
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-[#05081a]">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-green-500 transition-colors">
                              <FaGraduationCap className="text-5xl opacity-20" />
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent opacity-60 dark:from-[#0a0f2d]"></div>

                          {/* Free Badge */}
                          <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border border-green-400/20">
                            FREE ACCESS
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {course.title}
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                            {course.shortDescription
                              ? course.shortDescription.replace(
                                  /<[^>]*>?/gm,
                                  ""
                                )
                              : "Master the fundamentals with this comprehensive guide."}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <FaStar className="text-xs" />
                              <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                                {course.rating?.toFixed(1) || "5.0"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                              <FaClock />
                              <span>{course.duration || "Self-Paced"}</span>
                            </div>
                          </div>

                          {/* Hover Action */}
                          <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wide opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Start Learning <FaArrowRight />
                          </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-500">
                      <FaBookOpen className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No resources found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      We couldn't find any courses matching "{searchQuery}". Try
                      a different keyword or browse our main catalog.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-6 px-6 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FreeCourses;
