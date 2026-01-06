import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaUserFriends,
  FaGithub,
  FaPlay,
  FaCheckCircle,
  FaLayerGroup,
  FaIndustry,
  FaCode,
  FaExpand,
  FaDesktop,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImage,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectBySlug } from "../api/projectApi"; // Ensure this matches your API file
import { getImageUrl } from "../utils/imageUtils";

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // --- State ---
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery / Lightbox State
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await getProjectBySlug(slug);

        if (response.success && response.data) {
          const data = response.data;
          setProject(data);

          // Combine Hero + Gallery into one array for the slideshow
          // Filter out duplicates if hero is also in gallery
          // Ensure we have valid URLs for all images
          const rawImages = [
            data.heroImage || data.thumbnail,
            ...(data.gallery || []),
          ].filter(Boolean).map(img => 
            img.startsWith('http') ? img : getImageUrl(img)
          );

          // Unique images only
          const uniqueImages = [...new Set(rawImages)];
          setGalleryImages(uniqueImages);
        } else {
          throw new Error("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  // --- Gallery Navigation Logic ---
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, [galleryImages.length]);

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  // --- Helpers ---
  const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]";
      case "In Development":
        return "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]";
      case "Archived":
        return "bg-gray-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F47C26]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f2d] text-white">
        <h2 className="text-3xl font-bold mb-4 text-[#F47C26]">
          Project Not Found
        </h2>
        <button
          onClick={() => navigate("/services")}
          className="px-8 py-3 bg-[#F47C26] rounded-xl font-bold text-white hover:bg-[#d5671f] transition-all"
        >
          Return to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f2d] text-white font-sans relative overflow-x-hidden selection:bg-[#F47C26] selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F47C26]/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* --- HERO SECTION --- */}
      {/* --- NEW HERO SECTION (Split Layout) --- */}
      <div className="relative pb-16 lg:pt-24 lg:pb-16 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-b from-[#F47C26]/10 via-transparent to-transparent blur-[100px] rounded-full translate-x-1/3 -translate-y-1/4"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT COL: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Back Button */}
              <button
                onClick={() => navigate("/services")}
                className="flex items-center gap-2 text-white/60 hover:text-[#F47C26] mb-8 transition-colors group text-sm font-bold uppercase tracking-wider"
              >
                <div className="p-2 rounded-full border border-white/10 group-hover:border-[#F47C26] transition-colors">
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                </div>
                Back to Portfolio
              </button>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(
                    project.projectStatus
                  )
                    .replace("bg-", "border-")
                    .replace("text-white", "text-white bg-white/5")}`}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      getStatusColor(project.projectStatus).split(" ")[0]
                    }`}
                  ></span>
                  {project.projectStatus}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-[#0F1430] border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  {typeof project.category === "object"
                    ? project.category?.name
                    : "Project"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                {project.title}
                <span className="text-[#F47C26]">.</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-400 leading-relaxed mb-10 border-l-2 border-white/10 pl-6">
                {project.shortDescription}
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const gallerySection =
                      document.getElementById("project-gallery"); // You might need to add this ID to the gallery section
                    if (galleryImages.length > 0) {
                      setCurrentImageIndex(0);
                      setIsLightboxOpen(true);
                    }
                  }}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-[#0a0f2d] rounded-full font-bold hover:bg-gray-200 transition-all"
                >
                  <FaImage /> View Gallery
                </button>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/5 hover:border-[#F47C26] hover:text-[#F47C26] transition-all"
                  >
                    Live Demo <FaExternalLinkAlt size={12} />
                  </a>
                )}
              </div>
            </motion.div>

            {/* RIGHT COL: Image Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group perspective-1000"
            >
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 z-20 bg-[#F47C26] text-white p-4 rounded-2xl shadow-xl shadow-orange-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <FaDesktop size={24} />
              </div>

              {/* Main Image Container */}
              <div
                className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F1430] aspect-[4/3] cursor-pointer"
                onClick={() => {
                  setCurrentImageIndex(0);
                  setIsLightboxOpen(true);
                }}
              >
                {/* Image */}
                <img
                  src={project.heroImage || project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x600?text=Project+Showcase";
                  }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-bold flex items-center gap-2">
                    <FaExpand /> Expand View
                  </span>
                </div>
              </div>

              {/* Decorative "Blob" behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity -z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* === LEFT CONTENT (8/12) === */}
          <div className="lg:col-span-8 space-y-16">
            {/* 1. Overview Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-8"
            >
              {project.overview && (
                <>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Challenge */}
                    {project.overview.challenge && (
                      <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-[#F47C26]/40 transition-colors">
                        <h3 className="text-xl font-bold text-[#F47C26] mb-4 flex items-center gap-3">
                          <div className="p-2 bg-[#F47C26]/10 rounded-lg">
                            <FaLayerGroup />
                          </div>{" "}
                          The Challenge
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {project.overview.challenge}
                        </p>
                      </div>
                    )}
                    {/* Solution */}
                    {project.overview.solution && (
                      <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:border-blue-500/40 transition-colors">
                        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FaCode />
                          </div>{" "}
                          The Solution
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {project.overview.solution}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Result (Full Width) */}
                  {project.overview.result && (
                    <div className="bg-gradient-to-r from-[#F47C26]/10 to-transparent border border-[#F47C26]/20 p-10 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-10 text-[#F47C26]">
                        <FaCheckCircle size={100} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
                        <FaCheckCircle className="text-[#F47C26]" /> The Outcome
                      </h3>
                      <p className="text-gray-200 leading-relaxed text-xl relative z-10 font-light">
                        {project.overview.result}
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* 2. Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-[#F47C26] rounded-full"></span>{" "}
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-4">
                  {project.techStack.map((tech, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 px-6 py-4 bg-[#0F1430] border border-white/5 rounded-2xl shadow-lg hover:border-[#F47C26]/50 transition-all cursor-default"
                    >
                      {tech.iconUrl ? (
                        <img
                          src={getImageUrl(tech.iconUrl)}
                          alt={tech.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <FaCode className="text-[#F47C26]" size={20} />
                      )}
                      <span className="font-bold text-gray-200 text-lg">
                        {tech.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Full Description */}
            {project.fullDescription && (
              <div className="prose prose-invert prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-500 rounded-full"></span>{" "}
                  In-Depth Analysis
                </h3>
                <div className="text-gray-300 leading-8 whitespace-pre-line text-lg font-light">
                  {project.fullDescription}
                </div>
              </div>
            )}

            {/* 4. MODERN GALLERY STRIP */}
            {galleryImages.length > 0 && (
              <div className="pt-10 border-t border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaImage className="text-[#F47C26]" /> Project Gallery
                  </h3>
                  <button
                    onClick={() => {
                      setCurrentImageIndex(0);
                      setIsLightboxOpen(true);
                    }}
                    className="text-sm font-bold text-[#F47C26] hover:text-white transition-colors flex items-center gap-2"
                  >
                    View All <FaArrowRight />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.slice(0, 6).map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                      className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group bg-black/40 border border-white/5"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x400?text=Image+Not+Available";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FaExpand className="text-white text-2xl" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === RIGHT SIDEBAR (4/12) === */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              {/* Info Card */}
              <div className="bg-[#0F1430] border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F47C26]/10 rounded-full blur-[50px] -mr-10 -mt-10"></div>

                <h3 className="text-xl font-bold text-white mb-6">
                  Project Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-blue-400">
                      <FaUserFriends size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                        Client
                      </p>
                      <p className="text-white font-medium text-lg">
                        {project.clientName || "Confidential"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-purple-400">
                      <FaIndustry size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                        Industry
                      </p>
                      <p className="text-white font-medium text-lg">
                        {project.industry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-green-400">
                      <FaCalendarAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                        Completion
                      </p>
                      <p className="text-white font-medium text-lg">
                        {formatDate(project.completionDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30 group"
                    >
                      Visit Live Site{" "}
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {project.gitRepoUrlOne && (
                      <a
                        href={project.gitRepoUrlOne}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm transition-all"
                      >
                        <FaGithub /> Repo
                      </a>
                    )}
                    {project.videoUrl && (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm transition-all"
                      >
                        <FaPlay size={12} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              {project.metrics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0F1430] p-5 rounded-2xl border border-white/5 text-center hover:border-[#F47C26]/30 transition-colors">
                    <p className="text-3xl font-black text-white mb-1">
                      {project.metrics.durationInWeeks || 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Weeks
                    </p>
                  </div>
                  <div className="bg-[#0F1430] p-5 rounded-2xl border border-white/5 text-center hover:border-blue-500/30 transition-colors">
                    <p className="text-3xl font-black text-white mb-1">
                      {project.metrics.teamSize || 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Experts
                    </p>
                  </div>
                  <div className="bg-[#0F1430] p-5 rounded-2xl border border-white/5 text-center hover:border-purple-500/30 transition-colors">
                    <p className="text-3xl font-black text-white mb-1">
                      {project.metrics.totalScreens || 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Screens
                    </p>
                  </div>
                  <div className="bg-[#0F1430] p-5 rounded-2xl border border-white/5 text-center hover:border-green-500/30 transition-colors">
                    <p className="text-3xl font-black text-white mb-1">
                      {project.metrics.totalUsers || 0}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Users
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- IMMERSIVE LIGHTBOX OVERLAY --- */}
      {/* --- NEW IMMERSIVE LIGHTBOX --- */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#0a0f2d]/90 backdrop-blur-2xl flex flex-col items-center justify-center"
            onClick={() => setIsLightboxOpen(false)} // Close when clicking background
          >
            {/* 1. Header: Counter & Close Button */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
              {/* Counter Pill */}
              <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white/90 font-mono text-sm tracking-widest shadow-lg">
                {String(currentImageIndex + 1).padStart(2, "0")}{" "}
                <span className="text-white/30">/</span>{" "}
                {String(galleryImages.length).padStart(2, "0")}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="pointer-events-auto group p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#F47C26] hover:border-[#F47C26] transition-all duration-300 shadow-lg"
              >
                <FaTimes
                  className="group-hover:rotate-90 transition-transform duration-300"
                  size={20}
                />
              </button>
            </div>

            {/* 2. Main Image Stage */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 lg:pb-32">
              {/* Left Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 md:left-8 z-30 p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:scale-110 transition-all shadow-xl hidden md:flex"
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Image */}
              <motion.img
                key={currentImageIndex}
                src={galleryImages[currentImageIndex]}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()} // Prevent close on image click
                className="max-h-[80vh] max-w-[95vw] md:max-w-[85vw] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg ring-1 ring-white/10"
              />

              {/* Right Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 md:right-8 z-30 p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:scale-110 transition-all shadow-xl hidden md:flex"
              >
                <FaChevronRight size={20} />
              </button>
            </div>

            {/* 3. Floating Thumbnail Dock */}
            <div
              className="absolute bottom-6 md:bottom-10 z-50 max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-3 overflow-x-auto shadow-2xl">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                      currentImageIndex === idx
                        ? "ring-2 ring-[#F47C26] scale-110 opacity-100 grayscale-0"
                        : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105"
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`Thumb ${idx}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100?text=?";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetail;
