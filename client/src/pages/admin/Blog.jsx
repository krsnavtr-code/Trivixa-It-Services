import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getBlogPosts, deleteBlogPost } from "../../api/blogApi";

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
  });

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

  const fetchPosts = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: params.page || pagination.current,
        limit: pagination.pageSize,
        status: filters.status === "all" ? undefined : filters.status,
        search: filters.search,
      };

      const response = await getBlogPosts(queryParams);

      setPosts(response.data?.posts || []);
      setPagination({
        ...pagination,
        total: response.data?.total || 0,
        current: response.data?.currentPage || 1,
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts({ page: 1 });
  }, [filters]); // Refetch when filters change

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current: newPage }));
    fetchPosts({ page: newPage });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteBlogPost(id);
      toast.success("Blog post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Blog <span className="text-[#F47C26]">Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Create, edit, and manage content articles.
            </p>
          </div>

          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-[#F47C26] hover:bg-[#d5671f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
          >
            <FaPlus /> Create Article
          </Link>
        </div>

        {/* Visual Context: Content Workflow */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-80 hover:opacity-100 transition-opacity cursor-help"
          title="View Workflow"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            Content Publishing Lifecycle
          </span>
        </div>

        {/* --- Filters Toolbar --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative group col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all"
                placeholder="Search articles by title..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] appearance-none transition-all cursor-pointer"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
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
                    Article Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-transparent">
                <AnimatePresence>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          No blog posts found.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <motion.tr
                        key={post._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Title */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500">
                              {post.thumbnail ? (
                                <img
                                  src={post.thumbnail}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FaFileAlt />
                              )}
                            </div>
                            <div className="ml-4 max-w-xs">
                              <Link
                                to={`/admin/blog/edit/${post._id}`}
                                className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#F47C26] transition-colors line-clamp-1"
                              >
                                {post.title}
                              </Link>
                              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                /{post.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <FaUser className="mr-2 text-gray-400" />
                            {post.author?.fullname || "Unknown"}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              post.status === "published"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                : post.status === "draft"
                                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
                                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                            }`}
                          >
                            {post.status.charAt(0).toUpperCase() +
                              post.status.slice(1)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : "Unpublished"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/blog/edit/${post._id}`}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(post._id)}
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
          {pagination.total > pagination.pageSize && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page <span className="font-bold">{pagination.current}</span> of{" "}
                <span className="font-bold">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.current - 1))
                  }
                  disabled={pagination.current === 1}
                  className="p-2 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-white/20 transition-colors"
                >
                  <FaChevronLeft className="text-gray-600 dark:text-gray-300 text-xs" />
                </button>
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(totalPages, pagination.current + 1)
                    )
                  }
                  disabled={pagination.current >= totalPages}
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

export default BlogListPage;
