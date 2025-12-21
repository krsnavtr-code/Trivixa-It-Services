import React, { useState, useEffect } from "react";
import { getEmailRecords } from "../../api/adminApi";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPaperclip,
  FiUser,
  FiMail,
  FiCalendar,
  FiFileText,
  FiAlertCircle,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";

const EmailRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  // Animation Variants
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const handleViewDetails = (email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail(null);
  };

  const fetchEmailRecords = async () => {
    try {
      setLoading(true);
      const { data } = await getEmailRecords({
        page: page + 1,
        limit: rowsPerPage,
        ...(searchTerm && { to: searchTerm }),
      });

      setRecords(data.records || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch email records:", error);
      setRecords([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailRecords();
  }, [page, rowsPerPage]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPage(0);
      fetchEmailRecords();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "sent":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#05081a] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 px-6 py-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black">
              Transmission <span className="text-[#F47C26]">Log</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Audit trail of all outgoing communications.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative group flex-grow md:flex-grow-0 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#F47C26] transition-all"
                placeholder={t("common.search", "Search recipient...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>

            <button
              onClick={fetchEmailRecords}
              className="px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-[#F47C26] hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              title="Refresh Logs"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Visual Context: Infrastructure */}
        <div className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help" title="View Architecture">
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Delivery Infrastructure</span>
            
        </div>

        {/* --- Data Grid --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Target Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-transparent">
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div></div>
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No transmission records found.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <motion.tr
                        key={record._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Recipient Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-white/10">
                              <FiUser />
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {record.studentName && record.studentName !== "null" ? record.studentName : "System Proposal"}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                          {record.to}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                            {record.error && (
                              <div className="group/tooltip relative">
                                <FiAlertCircle className="text-red-500 cursor-help" />
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 bg-black text-white text-xs rounded p-2 hidden group-hover/tooltip:block z-50">
                                  {record.error}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <FiClock className="text-gray-400" />
                            {record.createdAt ? format(new Date(record.createdAt), "MMM d, HH:mm") : "-"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleViewDetails(record)}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#F47C26] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                            title="Inspect Log"
                          >
                            <FiEye />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* --- Pagination Footer --- */}
          {totalCount > 0 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing <span className="font-bold">{page * rowsPerPage + 1}</span> - <span className="font-bold">{Math.min((page + 1) * rowsPerPage, totalCount)}</span> of <span className="font-bold">{totalCount}</span>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#F47C26]"
                >
                  {[10, 25, 50].map(size => <option key={size} value={size}>{size} / page</option>)}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleChangePage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 transition-all"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={(page + 1) * rowsPerPage >= totalCount}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50 transition-all"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Details Modal --- */}
      <AnimatePresence>
        {isModalOpen && selectedEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0a0f2d] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${selectedEmail.status === 'sent' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <FiMail />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log Details</h3>
                    <p className="text-xs text-gray-500 font-mono">{selectedEmail._id}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 uppercase font-bold">Recipient</span>
                    <p className="text-sm font-medium truncate" title={selectedEmail.to}>{selectedEmail.to}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 uppercase font-bold">Timestamp</span>
                    <p className="text-sm font-medium">{selectedEmail.createdAt ? format(new Date(selectedEmail.createdAt), "PPpp") : "N/A"}</p>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Subject Line</label>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-sm font-medium">
                    {selectedEmail.subject}
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Message Content</label>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-sm max-h-60 overflow-y-auto custom-scrollbar prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.message }} />
                  </div>
                </div>

                {/* Attachments */}
                {selectedEmail.attachments?.length > 0 && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Assets Included</label>
                    <div className="space-y-2">
                      {selectedEmail.attachments.map((file, idx) => (
                        <a key={idx} href={file.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                          <FiPaperclip className="text-blue-500" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate flex-1">{file.name || `File ${idx + 1}`}</span>
                          <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100">Download</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-0 flex justify-end">
                <button onClick={closeModal} className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EmailRecords;