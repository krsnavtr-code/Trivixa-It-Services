import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaRegClock,
  FaArrowRight,
  FaCode,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../api/axios";

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// --- Modern Project Card Component ---
const ProjectCard = ({ course, index }) => {
  const [imageState, setImageState] = useState({
    url: "",
    error: false,
    loading: true,
  });

  // Keep your existing robust image loading logic
  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!course?.thumbnail) {
        if (isMounted)
          setImageState({
            url: "/images/course-placeholder.jpg",
            error: false,
            loading: false,
          });
        return;
      }

      let url = course.thumbnail;
      if (
        !url.startsWith("http") &&
        !url.startsWith("https") &&
        !url.startsWith("//")
      ) {
        const cleanPath = url.replace(/^\/+/, "");
        const baseUrl = API_BASE_URL || "";
        url = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
      }

      if (isMounted) setImageState({ url, error: false, loading: true });

      const img = new Image();
      img.onload = () =>
        isMounted && setImageState({ url, error: false, loading: false });
      img.onerror = () =>
        isMounted &&
        setImageState({
          url: "/images/course-placeholder.jpg",
          error: true,
          loading: false,
        });
      img.src = url;
    };

    loadImage();
    return () => {
      isMounted = false;
    };
  }, [course?._id, course?.thumbnail]);

  // Render Stars
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-xs ${
              i < Math.floor(rating || 5)
                ? "text-[#F47C26]"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      // Updated: Light mode gets white bg + shadow, Dark mode gets glass + border
      className="group relative bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-[#F47C26]/10 transition-all duration-300 flex flex-col h-full"
    >
      <Link
        to={`/course/${course.slug || course._id}`}
        className="block h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-900/50">
          {imageState.loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#F47C26] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <img
              src={imageState.url}
              alt={course.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          )}

          {/* Overlay Gradient: Lighter in light mode, Darker in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 dark:from-[#0a0f2d] dark:opacity-80"></div>

          {/* Featured Badge */}
          {course.isFeatured && (
            <div className="absolute top-3 right-3 bg-[#F47C26] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
              Featured Project
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative">
          {/* Floating Category Tag */}
          <div className="absolute -top-4 left-6">
            <span className="bg-white dark:bg-[#1a2d5c] border border-gray-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
              <FaCode className="text-xs" /> {course.level || "Web App"}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 leading-tight group-hover:text-[#F47C26] transition-colors">
            {course.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
            {course.shortDescription
              ?.replace(/^<p>/i, "")
              .replace(/<\/p>$/i, "")}
          </p>

          {/* Footer Details */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between mt-auto">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider">
                Client Rating
              </span>
              {renderStars(course.rating || 5)}
            </div>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
              <FaRegClock />
              <span>{course.duration || "4"} Weeks Dev</span>
            </div>
          </div>

          {/* Hover Action */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#F47C26] to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Main Featured Projects Component ---
const FeaturedProjects = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep existing API logic strictly intact
  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await axios.get("/courses", {
          params: {
            showOnHome: "true",
            limit: 4,
            sort: "-createdAt",
            isPublished: "true",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let fetchedCourses = [];
        if (Array.isArray(response.data)) fetchedCourses = response.data;
        else if (response.data && Array.isArray(response.data.data))
          fetchedCourses = response.data.data;
        else if (response.data && response.data.courses)
          fetchedCourses = response.data.courses;

        const featuredCourses = fetchedCourses.filter(
          (course) => course.showOnHome !== false
        );
        setCourses(featuredCourses);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  return (
    <section className="relative py-20 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden min-h-screen transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#F47C26] font-bold tracking-[0.2em] uppercase text-sm mb-3"
          >
            Portfolio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6"
          >
            Our Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Digital Solutions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Explore our curated selection of high-performance e-commerce and
            enterprise applications.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl h-[400px] animate-pulse relative overflow-hidden shadow-lg dark:shadow-none"
                >
                  <div className="h-48 bg-gray-200 dark:bg-white/5"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-2/3"></div>
                  </div>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-red-500/20 shadow-xl dark:shadow-none">
              <p className="text-red-500 dark:text-red-400 text-lg mb-4">
                Unable to load projects at this time.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg transition-colors border border-red-500/20"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence>
                {courses.map((course, index) => (
                  <ProjectCard key={course._id} course={course} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            to="/courses"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
          >
            <span className="relative z-10">View Full Portfolio</span>
            <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
