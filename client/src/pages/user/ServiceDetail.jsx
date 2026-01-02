import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaDesktop,
  FaUserFriends,
  FaGithub,
  FaGlobe,
  FaPlay,
  FaCheckCircle,
  FaLayerGroup,
  FaIndustry,
  FaCode,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getProjectById } from "../../api/projectApi";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  // Fetch Data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await getProjectById(id);

        if (response.success && response.data) {
          setProject(response.data);
          // Set initial active image
          const initialImage =
            response.data.gallery && response.data.gallery.length > 0
              ? response.data.gallery[0]
              : response.data.heroImage || response.data.thumbnail;
          setActiveImage(initialImage);
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4 text-[#F47C26]">
          Project Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || "The requested project could not be loaded."}
        </p>
        <button
          onClick={() => navigate("/services")}
          className="px-6 py-3 bg-[#F47C26] rounded-xl font-bold hover:bg-[#d5671f] transition-all text-white shadow-lg shadow-orange-500/20"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

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
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30";
      case "In Development":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30";
      case "Archived":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30";
    }
  };

  // Handle Category Name safely
  const categoryName =
    typeof project.category === "object" ? project.category?.name : "Project";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans relative overflow-x-hidden selection:bg-[#F47C26] selection:text-white transition-colors duration-500">
      {/* --- Background Ambience --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F47C26]/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden z-10">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src={project.heroImage || project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "http://trivixa.in/api/upload/file/trivixa-fix-size-brand-logo-21122025-1625.png";
            }}
          />
          {/* Gradient Overlay: Fades into specific background color based on mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent dark:from-[#0a0f2d] dark:via-[#0a0f2d]/90 dark:to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#F47C26] dark:hover:text-[#F47C26] mb-8 transition-colors group text-sm font-bold uppercase tracking-wider"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Services
            </button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(
                  project.projectStatus
                )}`}
              >
                {project.projectStatus}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
                {categoryName}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6 drop-shadow-sm dark:drop-shadow-2xl">
              {project.title}
            </h1>

            {/* Short Desc */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed font-light">
              {project.shortDescription}
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* === LEFT COLUMN (2/3) - Details === */}
          <div className="lg:col-span-2 space-y-12">
            {/* 1. Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-6"
            >
              {project.overview && (
                <>
                  {project.overview.challenge && (
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-xl dark:shadow-none hover:border-[#F47C26]/30 transition-colors">
                      <h3 className="text-xl font-bold text-[#F47C26] mb-4 flex items-center gap-3">
                        <div className="p-2 bg-[#F47C26]/10 rounded-lg">
                          <FaLayerGroup />
                        </div>
                        The Challenge
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {project.overview.challenge}
                      </p>
                    </div>
                  )}

                  {project.overview.solution && (
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-xl dark:shadow-none hover:border-blue-500/30 transition-colors">
                      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <FaCode />
                        </div>
                        The Solution
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {project.overview.solution}
                      </p>
                    </div>
                  )}

                  {project.overview.result && (
                    <div className="bg-gradient-to-br from-[#F47C26]/5 to-transparent border border-[#F47C26]/20 p-8 rounded-3xl dark:from-[#F47C26]/10 dark:border-[#F47C26]/30">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <FaCheckCircle className="text-green-500 dark:text-green-400" />
                        </div>
                        The Result
                      </h3>
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
                        {project.overview.result}
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* 2. Full Description */}
            {project.fullDescription && (
              <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-[#F47C26] pl-4">
                  Detailed Analysis
                </h2>
                <div className="whitespace-pre-line leading-relaxed opacity-90">
                  {project.fullDescription}
                </div>
              </div>
            )}

            {/* 3. Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaCode className="text-[#F47C26]" /> Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm dark:shadow-none transition-all cursor-default group hover:border-[#F47C26]/30"
                    >
                      {tech.iconUrl ? (
                        <img
                          src={tech.iconUrl}
                          alt={tech.name}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <FaCode className="text-gray-400 group-hover:text-[#F47C26] transition-colors" />
                      )}
                      <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#F47C26] dark:group-hover:text-white transition-colors">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Gallery */}
            {(project.gallery?.length > 0 || project.heroImage) && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Project Gallery
                </h3>
                <div className="space-y-4">
                  {/* Main Preview Frame */}
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/40 shadow-2xl">
                    <img
                      src={activeImage}
                      alt="Gallery Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Thumbnails Row */}
                  {project.gallery && project.gallery.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {project.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(img)}
                          className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                            activeImage === img
                              ? "border-[#F47C26] scale-105 shadow-lg shadow-orange-500/20"
                              : "border-transparent hover:border-gray-300 dark:hover:border-white/20 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumb ${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* === RIGHT COLUMN (Sidebar) === */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              {/* Project Info Card */}
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl space-y-6 shadow-xl dark:shadow-none">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4 uppercase tracking-widest">
                  Project Specs
                </h3>

                {/* Client */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                    <FaUserFriends className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
                      Client
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-bold">
                      {project.clientName || "Confidential"}
                    </p>
                  </div>
                </div>

                {/* Industry */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20 transition-colors">
                    <FaIndustry className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
                      Industry
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-bold">
                      {project.industry}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-500/20 transition-colors">
                    <FaCalendarAlt className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-500 uppercase font-bold tracking-wider">
                      Completion
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-bold">
                      {formatDate(project.completionDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              {project.metrics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl text-center hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                    <FaClock className="mx-auto text-[#F47C26] mb-2 text-xl" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {project.metrics.durationInWeeks || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">
                      Weeks
                    </p>
                  </div>
                  <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl text-center hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                    <FaUsers className="mx-auto text-blue-500 dark:text-blue-400 mb-2 text-xl" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {project.metrics.teamSize || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">
                      Team Size
                    </p>
                  </div>
                  <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl text-center hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                    <FaDesktop className="mx-auto text-purple-500 dark:text-purple-400 mb-2 text-xl" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {project.metrics.totalScreens || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">
                      Screens
                    </p>
                  </div>
                  <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl text-center hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                    <FaUserFriends className="mx-auto text-green-500 dark:text-green-400 mb-2 text-xl" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {project.metrics.totalUsers || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">
                      Users
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold text-center transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                  >
                    <FaGlobe /> Visit Live Site
                  </a>
                )}

                <div className="flex gap-3">
                  {project.gitRepoUrlOne && (
                    <a
                      href={project.gitRepoUrlOne}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 hover:border-[#F47C26]/50 dark:hover:border-[#F47C26]/50 shadow-sm dark:shadow-none"
                    >
                      <FaGithub /> Repo 1
                    </a>
                  )}
                  {project.videoUrl && (
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 hover:border-[#F47C26]/50 dark:hover:border-[#F47C26]/50 shadow-sm dark:shadow-none"
                    >
                      <FaPlay className="text-xs" /> Demo
                    </a>
                  )}
                </div>
              </div>

              {/* CTA Box */}
              {project.cta?.showInquiryButton && (
                <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-[#0a0f2d] border border-blue-100 dark:border-blue-500/20 p-6 rounded-3xl text-center relative overflow-hidden group shadow-lg dark:shadow-none">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 relative z-10">
                    Inspired by this project?
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 relative z-10">
                    Let's build something amazing for your business.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-[#F47C26] font-bold hover:underline relative z-10 group-hover:translate-x-1 duration-300"
                  >
                    {project.cta.inquiryLabel || "Start a Similar Project"}
                    <FaExternalLinkAlt className="text-xs" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
