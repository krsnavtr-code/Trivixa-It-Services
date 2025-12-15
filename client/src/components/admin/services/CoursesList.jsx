import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaDownload,
  FaPaperPlane,
  FaPlus,
  FaFilter,
  FaLayerGroup,
  FaSpinner,
} from "react-icons/fa";
import {
  getCourses,
  deleteCourse,
  getCategoriesForForm,
} from "../../../api/servicesApi";
import api from "../../../api/axios";
import SendCoursePdfModal from "./SendCoursePdfModal";
import { motion, AnimatePresence } from "framer-motion";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHomeFilter, setShowHomeFilter] = useState("all");
  const [generatingPdf, setGeneratingPdf] = useState(null);
  const [deletingPdf, setDeletingPdf] = useState(null);

  // Local Storage State Initialization
  const [pdfUrls, setPdfUrls] = useState(() => {
    const saved = localStorage.getItem("pdfUrls");
    return saved ? JSON.parse(saved) : {};
  });
  const [coursesWithPdf, setCoursesWithPdf] = useState(() => {
    const saved = localStorage.getItem("coursesWithPdf");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [showSendPdfModal, setShowSendPdfModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategoriesForForm();
        setCategories(categoriesData);

        const params = {
          category: selectedCategory || undefined,
          search: searchTerm || undefined,
          showOnHome:
            showHomeFilter !== "all"
              ? showHomeFilter === "yes"
                ? "true"
                : "false"
              : undefined,
          all: "true",
        };

        Object.keys(params).forEach(
          (key) => params[key] === undefined && delete params[key]
        );

        const response = await getCourses(
          new URLSearchParams(params).toString(),
          true
        );

        let coursesData = [];
        if (Array.isArray(response)) {
          coursesData = response;
        } else if (response && Array.isArray(response.data)) {
          coursesData = response.data;
        } else if (
          response &&
          response.data &&
          typeof response.data === "object"
        ) {
          coursesData = Object.values(response.data);
        }

        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, searchTerm, showHomeFilter]);

  useEffect(() => {
    localStorage.setItem(
      "coursesWithPdf",
      JSON.stringify(Array.from(coursesWithPdf))
    );
    localStorage.setItem("pdfUrls", JSON.stringify(pdfUrls));
  }, [coursesWithPdf, pdfUrls]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course._id !== id));
        toast.success("Course deleted successfully");
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleGeneratePdf = async (course) => {
    try {
      setGeneratingPdf(course._id);
      const response = await api.post(`/services/${course._id}/generate-pdf`);

      const newCoursesWithPdf = new Set([...coursesWithPdf, course._id]);
      const newPdfUrls = {
        ...pdfUrls,
        [course._id]: {
          url: response.data.fileUrl,
          filename: response.data.filename,
        },
      };

      setCoursesWithPdf(newCoursesWithPdf);
      setPdfUrls(newPdfUrls);
      toast.success("PDF generated successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(error.response?.data?.message || "Failed to generate PDF");
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleDeletePdf = async (course) => {
    if (!window.confirm("Delete this PDF? This cannot be undone.")) return;

    try {
      setDeletingPdf(course._id);
      const pdfInfo = pdfUrls[course._id];
      if (!pdfInfo || !pdfInfo.url) throw new Error("PDF URL not found");

      await api.delete(`/services/${course._id}/pdf`, {
        data: { fileUrl: pdfInfo.url },
      });

      const newPdfUrls = { ...pdfUrls };
      delete newPdfUrls[course._id];
      const newCoursesWithPdf = new Set(coursesWithPdf);
      newCoursesWithPdf.delete(course._id);

      setPdfUrls(newPdfUrls);
      setCoursesWithPdf(newCoursesWithPdf);
      toast.success("PDF deleted successfully");
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Failed to delete PDF");
    } finally {
      setDeletingPdf(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Course <span className="text-[#F47C26]">Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage curriculum, pricing, and distribution assets.
            </p>
          </div>

          <Link
            to="new"
            className="inline-flex items-center gap-2 bg-[#F47C26] hover:bg-[#d5671f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
          >
            <FaPlus /> Add New Course
          </Link>
        </div>

        {/* Visual Context: Workflow */}
        <div className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            Content Operations
          </span>
        </div>

        {/* --- Filters Toolbar --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLayerGroup className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] appearance-none transition-all cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {/* Custom Arrow */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400 text-xs" />
              </div>
            </div>

            {/* Visibility Filter */}
            <div className="relative">
              <select
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] appearance-none transition-all cursor-pointer"
                value={showHomeFilter}
                onChange={(e) => setShowHomeFilter(e.target.value)}
              >
                <option value="all">All Visibility</option>
                <option value="yes">Home Page Only</option>
                <option value="no">Hidden from Home</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Data Grid --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-transparent">
                <AnimatePresence>
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          No courses found matching your criteria.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <motion.tr
                        key={course._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Course Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-white/10 border border-gray-200 dark:border-white/10">
                              {course.image ? (
                                <img
                                  className="h-full w-full object-cover"
                                  src={course.image}
                                  alt=""
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors">
                                {course.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {course.level || "Beginner"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                            {course.category?.name || "General"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-mono">
                          ₹{course.price?.toFixed(2) || "0.00"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                course.isPublished
                                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                  : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
                              }`}
                            >
                              {course.isPublished ? "Live" : "Draft"}
                            </span>
                            {course.showOnHome && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                                Home
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit */}
                            <Link
                              to={`/admin/services/${course._id}/edit`}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Edit Course"
                            >
                              <FaEdit />
                            </Link>

                            {/* PDF Controls */}
                            {pdfUrls[course._id] ? (
                              <button
                                onClick={() => handleDeletePdf(course)}
                                disabled={deletingPdf === course._id}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors relative"
                                title="Delete PDF Brochure"
                              >
                                {deletingPdf === course._id ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaTrash className="text-xs" /> // Differentiate visually
                                )}
                                <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-[#0a0f2d]"></span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleGeneratePdf(course)}
                                disabled={generatingPdf === course._id}
                                className={`p-2 rounded-lg transition-colors ${
                                  generatingPdf === course._id
                                    ? "text-gray-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-[#F47C26] hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                }`}
                                title="Generate PDF Brochure"
                              >
                                {generatingPdf === course._id ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaFilePdf />
                                )}
                              </button>
                            )}

                            {/* Send PDF */}
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowSendPdfModal(true);
                              }}
                              className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              title="Email PDF to Candidate"
                            >
                              <FaPaperPlane />
                            </button>

                            {/* Delete Course */}
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete Course Permanently"
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
        </div>
      </div>

      {/* Send PDF Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <SendCoursePdfModal
            course={selectedCourse}
            isOpen={showSendPdfModal}
            onClose={() => {
              setShowSendPdfModal(false);
              setSelectedCourse(null);
            }}
            onSuccess={() => {
              // fetchCourses(); // Optionally refresh if needed
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesList;
