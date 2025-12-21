import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../api/axios";
import {
  FaArrowLeft,
  FaMoneyBillWave,
  FaUser,
  FaCreditCard,
  FaBox,
  FaCalendarAlt,
  FaFingerprint,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCopy,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await api.get(`/admin/payments/${id}`);
        setPayment(response.data.payment);
      } catch (err) {
        console.error("Error fetching payment:", err);
        toast.error("Failed to retrieve transaction data");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "medium",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "text-green-400",
          icon: <FaCheckCircle />,
          label: "Verified",
          glow: "shadow-[0_0_15px_rgba(74,222,128,0.5)]",
        };
      case "failed":
        return {
          color: "text-red-400",
          icon: <FaTimesCircle />,
          label: "Declined",
          glow: "shadow-[0_0_15px_rgba(248,113,113,0.5)]",
        };
      default:
        return {
          color: "text-yellow-400",
          icon: <FaClock />,
          label: "Processing",
          glow: "shadow-[0_0_15px_rgba(250,204,21,0.5)]",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <FaBox className="text-6xl mb-4 opacity-50" />
        <p>Transaction record not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
        >
          Return to Ledger
        </button>
      </div>
    );
  }

  const statusStyle = getStatusBadge(payment.status);

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8 max-w-7xl mx-auto relative z-10">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-black">
                Transaction <span className="text-[#F47C26]">Inspector</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                REF: {payment._id}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-full bg-[#0a0f2d] border border-white/10 ${statusStyle.glow}`}
          >
            <span className={`text-xl ${statusStyle.color}`}>
              {statusStyle.icon}
            </span>
            <span
              className={`font-bold uppercase tracking-wider ${statusStyle.color}`}
            >
              {statusStyle.label}
            </span>
          </div>
        </div>

        {/* Visual Context: Verification */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help"
          title="View Process"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            Payment Verification Status
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Column 1: Financials & Customer --- */}
          <div className="space-y-6 lg:col-span-2">
            {/* Amount Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">
                  Total Transaction Value
                </p>
                <div className="text-5xl font-black text-gray-900 dark:text-white">
                  ₹{payment.paymentAmount?.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-500/20 rounded-2xl text-green-600 dark:text-green-400 text-3xl">
                <FaMoneyBillWave />
              </div>
            </motion.div>

            {/* Payer Identity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FaUser className="text-[#F47C26]" /> Payer Identity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Full Name
                  </p>
                  <p className="text-lg font-medium">{payment.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Email Address
                  </p>
                  <p className="text-lg font-medium">{payment.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Contact Number
                  </p>
                  <p className="text-lg font-medium font-mono">
                    {payment.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Billing Address
                  </p>
                  <div className="flex gap-2">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <p className="text-md font-medium whitespace-pre-line">
                      {payment.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FaBox className="text-blue-500" /> Service Details
              </h3>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                  Course / Product Name
                </p>
                <div className="p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-xl font-medium">
                  {payment.course || "General Payment"}
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- Column 2: Audit Trail & Technicals --- */}
          <div className="space-y-6">
            {/* Technical IDs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaFingerprint className="text-purple-500" /> Digital
                Fingerprints
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-[#0a0f2d]/50 rounded-xl border border-gray-200 dark:border-white/5 group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      Payment Gateway ID
                    </span>
                    <button
                      onClick={() => copyToClipboard(payment.paymentId)}
                      className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaCopy />
                    </button>
                  </div>
                  <p className="font-mono text-sm break-all">
                    {payment.paymentId || "N/A"}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-[#0a0f2d]/50 rounded-xl border border-gray-200 dark:border-white/5 group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      System Order ID
                    </span>
                    <button
                      onClick={() => copyToClipboard(payment._id)}
                      className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaCopy />
                    </button>
                  </div>
                  <p className="font-mono text-sm break-all">{payment._id}</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-teal-500" /> Timeline
              </h3>

              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:h-[90%] before:w-[2px] before:bg-white/10">
                <div className="relative pl-8">
                  <div className="absolute left-[3px] top-1 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Created
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>

                {payment.paymentDate && (
                  <div className="relative pl-8">
                    <div className="absolute left-[3px] top-1 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Processed
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                )}

                <div className="relative pl-8">
                  <div className="absolute left-[3px] top-1 w-3 h-3 bg-gray-500 rounded-full"></div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(payment.updatedAt)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Method */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaCreditCard className="text-pink-500" /> Payment Method
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl">
                <span className="font-bold">Razorpay</span>
                <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                  Secure
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
