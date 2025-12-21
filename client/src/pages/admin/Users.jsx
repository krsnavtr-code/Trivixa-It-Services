import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaFilter,
  FaShieldAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEnvelope,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import api from "../../utils/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      // Handle potential response structures safely
      const userData = response.data?.data?.users || response.data?.users || [];
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Failed to load personnel data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = users;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullname?.toLowerCase().includes(lowerTerm) ||
          u.email?.toLowerCase().includes(lowerTerm)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== "all") {
      const isApproved = statusFilter === "approved";
      result = result.filter((u) => u.isApproved === isApproved);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleApprove = async (userId) => {
    try {
      await api.patch(`/admin/approve-user/${userId}`);
      toast.success("Access granted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to approve access");
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Permanently revoke access for this user?")) return;
    try {
      await api.delete(`/admin/reject-user/${userId}`);
      toast.success("User access revoked");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to revoke access");
    }
  };

  // Helper to get role icon/color
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return {
          icon: <FaShieldAlt />,
          style:
            "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
          label: "Admin",
        };
      case "teacher":
        return {
          icon: <FaChalkboardTeacher />,
          style:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
          label: "Instructor",
        };
      default:
        return {
          icon: <FaUserGraduate />,
          style:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
          label: "Student",
        };
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Personnel <span className="text-[#F47C26]">Directory</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage system access and user roles.
            </p>
          </div>
        </div>

        {/* Visual Context: Roles */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-80 hover:opacity-100 transition-opacity cursor-help"
          title="View Hierarchy"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
            Access Control Hierarchy
          </span>
        </div>

        {/* --- Filters Toolbar --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {/* Role Filter */}
              <div className="relative group flex-1 md:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] appearance-none cursor-pointer"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="teacher">Instructors</option>
                  <option value="student">Students</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                className="block flex-1 md:flex-none px-4 py-2.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
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
                    User Profile
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Access Status
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
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        No users found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleBadge = getRoleBadge(user.role);
                      return (
                        <motion.tr
                          key={user._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                        >
                          {/* Profile */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-500 font-bold border border-gray-300 dark:border-white/10">
                                {user.fullname?.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors">
                                  {user.fullname}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                  <FaEnvelope className="text-[10px]" />{" "}
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${roleBadge.style}`}
                            >
                              {roleBadge.icon}
                              {roleBadge.label}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isApproved ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-bold border border-yellow-200 dark:border-yellow-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                Pending Approval
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {!user.isApproved ? (
                                <>
                                  <button
                                    onClick={() => handleApprove(user._id)}
                                    className="p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:text-green-400 transition-colors"
                                    title="Approve Access"
                                  >
                                    <FaUserCheck />
                                  </button>
                                  <button
                                    onClick={() => handleReject(user._id)}
                                    className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 transition-colors"
                                    title="Reject Access"
                                  >
                                    <FaUserTimes />
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                                  No actions pending
                                </span>
                              )}
                            </div>
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
};
export default Users;
