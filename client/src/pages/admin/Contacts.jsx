import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getContacts, updateContactStatus } from "../../api/contactApi";
import { format, parseISO } from "date-fns";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFileCsv,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaFilter,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
} from "react-icons/fa";

const statusColors = {
  new: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  contacted:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  in_progress:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  spam: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  admission_done:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
};

const statusOptions = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "admission_done", label: "Converted" },
  { value: "spam", label: "Spam" },
];

const ContactsList = () => {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    course: "",
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const fetchContacts = async (exportMode = false) => {
    if (!isAuthenticated) return;

    try {
      if (!exportMode) setLoading(true);

      const params = {
        page: exportMode ? 1 : pagination.page,
        limit: exportMode ? 1000 : pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.date && { date: filters.date }),
        ...(filters.course && { course: filters.course }),
      };

      const response = await getContacts(params);

      if (response.success) {
        if (exportMode) return response.data; // Return data for export function

        setContacts(response.data || []);
        const totalItems = response.meta?.total || response.data?.length || 0;
        setPagination((prev) => ({
          ...prev,
          total: totalItems,
          totalPages: Math.ceil(totalItems / prev.limit) || 1,
          page: response.meta?.currentPage || prev.page,
        }));
      } else {
        toast.error(response.message || "Failed to load contacts");
        if (response.shouldLogout) {
          logout();
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("An error occurred while fetching contacts");
    } finally {
      if (!exportMode) setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchContacts();
    }
  }, [pagination.page, filters, isAuthenticated, authLoading]);

  const handleExport = async () => {
    try {
      const data = await fetchContacts(true); // Fetch all data
      if (data?.length > 0) {
        const headers = [
          "S.No",
          "Name",
          "Email",
          "Phone",
          "Course",
          "Message",
          "Status",
          "Date",
          "Time",
        ];

        const csvRows = data.map((c, index) =>
          [
            index + 1,
            `"${c.name.replace(/"/g, '""')}"`,
            `"${c.email}"`,
            `"${c.phone ? `'${c.phone}` : ""}"`,
            `"${c.courseTitle || ""}"`,
            `"${(c.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
            `"${c.status}"`,
            `"${format(new Date(c.submittedAt || c.createdAt), "yyyy-MM-dd")}"`,
            `"${format(new Date(c.submittedAt || c.createdAt), "HH:mm")}"`,
          ].join(",")
        );

        const csvContent = [headers.join(","), ...csvRows].join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(
          blob,
          `contacts_export_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`
        );
        toast.success("Export successful");
      } else {
        toast.warning("No data to export");
      }
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await updateContactStatus(id, newStatus, token);
      toast.success("Status updated");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (authLoading)
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Communication <span className="text-[#F47C26]">Hub</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Track inquiries and student leads.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 bg-[#F47C26] hover:bg-[#d5671f] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
          >
            <FaFileCsv /> Export Data
          </button>
        </div>

        {/* Visual Context: Workflow */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-80 hover:opacity-100 transition-opacity cursor-help"
          title="View Process"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            Lead Response Workflow
          </span>
        </div>

        {/* --- Filters Toolbar --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <div className="relative group flex-1 md:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value });
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] appearance-none transition-all cursor-pointer text-sm"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative group flex-1 md:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => {
                    setFilters({ ...filters, date: e.target.value });
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] text-sm"
                />
              </div>
            </div>

            {/* Course Filter */}
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filters.course}
                onChange={(e) => {
                  setFilters({ ...filters, course: e.target.value });
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#F47C26] appearance-none"
              >
                <option value="">All Courses / Subjects</option>
                {Array.from(
                  new Set(contacts.map((c) => c.courseTitle).filter(Boolean))
                ).map((course, idx) => (
                  <option key={idx} value={course}>
                    {course}
                  </option>
                ))}
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
                    Contact Profile
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Context
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-transparent">
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div>
                        </div>
                      </td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-12 text-center text-gray-500"
                      >
                        No records found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <motion.tr
                        key={contact._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Profile */}
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">
                                {contact.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                <FaEnvelope className="text-[10px]" />{" "}
                                {contact.email}
                              </div>
                              {contact.phone && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  <FaPhone className="text-[10px]" />{" "}
                                  {contact.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Context */}
                        <td className="px-6 py-4">
                          {contact.courseTitle && (
                            <span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {contact.courseTitle}
                            </span>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic">
                            "{contact.message}"
                          </p>
                        </td>

                        {/* Timeline */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <FaCalendarAlt className="text-gray-400" />
                            {format(
                              new Date(
                                contact.submittedAt || contact.createdAt
                              ),
                              "MMM d, yyyy"
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <FaClock className="text-gray-400" />
                            {format(
                              new Date(
                                contact.submittedAt || contact.createdAt
                              ),
                              "h:mm a"
                            )}
                          </div>
                        </td>

                        {/* Status Action */}
                        <td className="px-6 py-4">
                          <select
                            value={contact.status}
                            onChange={(e) =>
                              handleStatusChange(contact._id, e.target.value)
                            }
                            className={`block w-full px-3 py-1.5 bg-white dark:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0a0f2d] ${
                              statusColors[contact.status]
                            }`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex justify-center gap-2">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: num }))
                  }
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                    pagination.page === num
                      ? "bg-[#F47C26] text-white shadow-lg"
                      : "bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsList;
