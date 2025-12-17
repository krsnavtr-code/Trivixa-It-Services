import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaLayerGroup,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";
import { getCategories, deleteCategory } from "../../api/categoryApi";
import { motion, AnimatePresence } from "framer-motion";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [showHomeFilter, setShowHomeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();

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
    fetchCategories();
  }, [currentPage, itemsPerPage, statusFilter]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = {
        limit: itemsPerPage,
        page: currentPage,
        status: statusFilter === "all" ? undefined : statusFilter,
      };

      const response = await getCategories(params);

      if (response?.success && response?.data) {
        setCategories(response.data);
        setTotalCount(response.pagination?.total || response.data.length);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((category) => {
        const matchesSearch =
          category?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          (category?.description &&
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));

        const matchesHomeFilter =
          showHomeFilter === "all" ||
          (showHomeFilter === "yes" && category?.showOnHome) ||
          (showHomeFilter === "no" && !category?.showOnHome);

        return matchesSearch && matchesHomeFilter;
      })
    : [];

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Category <span className="text-[#F47C26]">Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Organize and structure your service offerings.
            </p>
          </div>

          <button
            onClick={() => navigate("new")}
            className="inline-flex items-center gap-2 bg-[#F47C26] hover:bg-[#d5671f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
          >
            <FaPlus /> Add New Category
          </button>
        </div>

        {/* Visual Context: Taxonomy */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-80 hover:opacity-100 transition-opacity cursor-help"
          title="View Structure"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            Service Taxonomy
          </span>
        </div>

        {/* --- Filters Toolbar --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative group col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] appearance-none transition-all cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* Home Filter */}
            <div className="relative">
              <select
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] appearance-none transition-all cursor-pointer"
                value={showHomeFilter}
                onChange={(e) => setShowHomeFilter(e.target.value)}
              >
                <option value="all">All Visibility</option>
                <option value="yes">Home Page</option>
                <option value="no">Hidden</option>
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
                    Category Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Home Display
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
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          No categories found matching your criteria.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <motion.tr
                        key={category._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Name & Icon */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center">
                              {category.image ? (
                                <img
                                  className="h-full w-full object-cover"
                                  src={category.image}
                                  alt={category.name}
                                />
                              ) : (
                                <FaLayerGroup className="text-gray-400" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {category.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Home Visibility */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.showOnHome ? (
                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                              Visible
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                              Hidden
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              category.isActive
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                            }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/categories/${category._id}/edit`
                                )
                              }
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Edit Category"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete Category"
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

export default CategoriesList;
