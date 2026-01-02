import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaStar,
  FaGithub,
  FaGlobe,
  FaLayerGroup,
  FaChevronLeft,
  FaChevronRight,
  FaCode,
  FaEye,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// APIs
import { getProjects, deleteProject } from "../../api/projectApi";
import { getCategories } from "../../api/categoryApi";

const ProjectList = () => {
  const navigate = useNavigate();

  // --- State ---
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Pagination & Loading
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Standard list view count

  // --- Effects ---

  // 1. Fetch Categories for Filter
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories({ limit: 100, status: "active" });
        if (res?.success) setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories filter");
      }
    };
    fetchCats();
  }, []);

  // 2. Fetch Projects
  useEffect(() => {
    fetchProjects();
  }, [
    currentPage,
    itemsPerPage,
    selectedCategory,
    statusFilter,
    visibilityFilter,
  ]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        isActive:
          statusFilter === "all" ? undefined : statusFilter === "active",
        visibility: visibilityFilter !== "all" ? visibilityFilter : undefined,
      };

      const response = await getProjects(params);

      if (response?.success) {
        setProjects(response.data);
        setTotalCount(response.pagination?.total || response.data.length);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project permanently?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted");
        fetchProjects();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // Client-side search fallback
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // --- Render Helpers ---
  const inputClass =
    "block w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all";
  const thClass =
    "px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider";

  if (loading && projects.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative bg-gray-50 dark:bg-[#0a0f2d]">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Project <span className="text-[#F47C26]">Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage your portfolio case studies and featured work.
            </p>
          </div>
          <button
            onClick={() => navigate("new")}
            className="inline-flex items-center gap-2 bg-[#F47C26] hover:bg-[#d5671f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
          >
            <FaPlus /> Add New Project
          </button>
        </div>

        {/* --- Toolbar --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative group md:col-span-2">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              <input
                type="text"
                placeholder="Search projects by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`${inputClass} appearance-none pl-4 cursor-pointer`}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FaLayerGroup className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${inputClass} appearance-none pl-4 cursor-pointer`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Hidden</option>
              </select>
              <FaFilter className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Visibility Filter */}
            <div className="relative">
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className={`${inputClass} appearance-none pl-4 cursor-pointer`}
              >
                <option value="all">All Visibility</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Draft">Draft</option>
              </select>
              <FaEye className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- List Table --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className={thClass}>Project Details</th>
                  <th className={thClass}>Category</th>
                  <th className={`${thClass} hidden md:table-cell`}>
                    Tech Stack
                  </th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-transparent">
                <AnimatePresence>
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          No projects found matching your criteria.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <motion.tr
                        key={project._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* 1. Project Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                              <img
                                className="h-full w-full object-cover"
                                src={project.thumbnail}
                                alt={project.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors">
                                {project.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                                {project.shortDescription}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Category */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                            {project.category?.name || "Uncategorized"}
                          </span>
                          {project.subCategory && (
                            <div className="text-[10px] text-gray-400 mt-1 pl-1">
                              ↳ {project.subCategory.name}
                            </div>
                          )}
                        </td>

                        {/* 3. Tech Stack (Hidden on Mobile) */}
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex -space-x-2 overflow-hidden">
                            {project.technologies
                              ?.slice(0, 3)
                              .map((tech, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-white dark:border-gray-800 ring-2 ring-white dark:ring-[#0a0f2d]"
                                  title={tech}
                                >
                                  {tech.slice(0, 2).toUpperCase()}
                                </span>
                              ))}
                            {project.technologies?.length > 3 && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-medium bg-gray-200 dark:bg-white/20 text-gray-600 dark:text-gray-300 border border-white dark:border-gray-800 ring-2 ring-white dark:ring-[#0a0f2d]">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. Status & Badges */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {project.isActive ? (
                              <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20 w-fit">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20 w-fit">
                                Hidden
                              </span>
                            )}
                            {project.isFeatured && (
                              <span className="px-2 py-0.5 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 w-fit">
                                <FaStar className="text-[10px]" /> Featured
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {/* External Links */}
                            <div className="mr-3 flex gap-2 border-r border-gray-200 dark:border-white/10 pr-3">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-[#F47C26] transition-colors"
                                  title="View Live"
                                >
                                  <FaGlobe />
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-[#F47C26] transition-colors"
                                  title="View Code"
                                >
                                  <FaGithub />
                                </a>
                              )}
                            </div>

                            {/* CRUD */}
                            <button
                              onClick={() =>
                                navigate(`/admin/projects/${project._id}/edit`)
                              }
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* --- Pagination --- */}
          {totalCount > itemsPerPage && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page <span className="font-bold">{currentPage}</span> of{" "}
                <span className="font-bold">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-white/20 transition-colors"
                >
                  <FaChevronLeft className="text-gray-600 dark:text-gray-300 text-xs" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-white/20 transition-colors"
                >
                  <FaChevronRight className="text-gray-600 dark:text-gray-300 text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
