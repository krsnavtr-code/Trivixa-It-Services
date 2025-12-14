import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaRegClock,
  FaArrowRight,
  FaCode,
  FaExternalLinkAlt,
  FaLayerGroup,
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
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-[10px] ${
              i < Math.floor(rating || 5)
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group relative h-full"
    >
      <Link
        to={`/course/${course.slug || course._id}`}
        className="block h-full flex flex-col bg-white dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-[#F47C26]/10 transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-900/50">
          {imageState.loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#F47C26] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <img
              src={imageState.url}
              alt={course.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 dark:opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <FaCode className="text-[#F47C26]" /> {course.level || "Solution"}
            </span>
            {course.isFeatured && (
              <span className="bg-[#F47C26] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Featured
              </span>
            )}
          </div>

          {/* Floating Action Button (Appears on Hover) */}
          <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
            <div className="w-12 h-12 bg-white text-[#F47C26] rounded-full flex items-center justify-center shadow-lg hover:bg-[#F47C26] hover:text-white transition-colors">
              <FaArrowRight />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative bg-white dark:bg-[#0a0f2d] z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#F47C26] uppercase tracking-widest mb-1">
                {course.category?.name || "Development"}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-[#F47C26] transition-colors">
                {course.title}
              </h3>
            </div>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
            {course.shortDescription
              ?.replace(/^<p>/i, "")
              .replace(/<\/p>$/i, "") ||
              "A robust, scalable solution tailored for modern business needs."}
          </p>

          {/* Tech Stack / Stats Footer */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-[#0a0f2d] flex items-center justify-center text-[8px] font-bold text-gray-500 dark:text-gray-300"
                  >
                    {i === 1 ? "R" : i === 2 ? "N" : "JS"}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                + Stack
              </span>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                <FaRegClock /> {course.duration || "4"} Weeks
              </div>
              {renderStars(course.rating || 5)}
            </div>
          </div>
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

        const response = await axios.get("/services", {
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
    <section className="relative py-32 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden min-h-screen transition-colors duration-300">
      {/* --- Background --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-2xl">
            <motion.span
              className="px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-[#F47C26] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#F47C26] animate-pulse"></span>
              Selected Works
            </motion.span>

            <motion.h2
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight"
            >
              Featured <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Deployments
              </span>
            </motion.h2>
          </div>

          <motion.div
            transition={{ delay: 0.2 }}
            className="hidden md:block"
          >
            <p className="text-gray-500 dark:text-gray-400 text-right max-w-xs text-sm mb-4">
              A curated selection of our most impactful digital solutions,
              engineered for scale and performance.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#F47C26] hover:text-[#d5671f] transition-colors float-right group"
            >
              View Full Portfolio{" "}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-3xl h-[450px] animate-pulse relative overflow-hidden shadow-lg dark:shadow-none"
                >
                  <div className="h-64 bg-gray-200 dark:bg-white/5"></div>
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

        {/* Diagram Context: Visualizing project impact metrics */}
        <div className="mt-16 flex justify-center opacity-80 h-0 w-0 overflow-hidden"></div>

        {/* Footer CTA (Mobile Only) */}
        <motion.div
          transition={{ delay: 0.4 }}
          className="mt-16 text-center md:hidden"
        >
          <Link
            to="/services"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
          >
            <span className="relative z-10">View Full Portfolio</span>
            <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
