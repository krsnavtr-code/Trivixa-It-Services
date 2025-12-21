import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoneyBillWave,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaEye,
} from "react-icons/fa";

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/admin/payments");
        setPayments(response.data.payments);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments");
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Animation Variants
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Status Styling Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-500/10",
          border: "border-green-200 dark:border-green-500/20",
          icon: <FaCheckCircle />,
          label: "Paid",
        };
      case "failed":
        return {
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-500/10",
          border: "border-red-200 dark:border-red-500/20",
          icon: <FaTimesCircle />,
          label: "Failed",
        };
      default:
        return {
          color: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-100 dark:bg-yellow-500/10",
          border: "border-yellow-200 dark:border-yellow-500/20",
          icon: <FaClock />,
          label: "Pending",
        };
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Financial <span className="text-[#F47C26]">Ledger</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Track direct course enrollments and transactions.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] transition-all"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Visual Context: Payment Flow */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-80 hover:opacity-100 transition-opacity cursor-help"
          title="View Flow"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            Transaction Lifecycle
          </span>
        </div>

        {/* --- Data Grid --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payer Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course / Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
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
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => {
                      const statusStyle = getStatusBadge(payment.status);
                      return (
                        <motion.tr
                          key={payment._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                        >
                          {/* Payer */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 mr-3 border border-gray-200 dark:border-white/10">
                                <FaUser />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors">
                                  {payment.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {payment.email}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                  {payment.phone}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Course */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                            {payment.course}
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-gray-900 dark:text-white">
                              ₹
                              {payment.paymentAmount?.toLocaleString("en-IN") ||
                                "0"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
                            >
                              {statusStyle.icon}
                              {statusStyle.label}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(
                              payment.paymentDate || payment.createdAt
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/admin/payments/${payment._id}`}
                              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-[#F47C26] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                              title="View Receipt"
                            >
                              <FaEye />
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
