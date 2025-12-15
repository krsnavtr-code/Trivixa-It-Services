import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCategories } from "../../api/categoryApi";
import { getCourses, deleteCourse } from "../../api/servicesApi";
import userApi from "../../api/userApi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaLayerGroup,
  FaBook,
  FaUsers,
  FaMoneyBillWave,
  FaPlus,
  FaArrowRight,
  FaChartLine,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        const response = await getCourses();
        setCourses(response.data || []);
        toast.success("Course deleted successfully");
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Parallel fetching for speed
        const [categoriesRes, coursesRes, usersRes] = await Promise.allSettled([
          getCategories(),
          getCourses(),
          userApi.getUsers(),
        ]);

        if (categoriesRes.status === "fulfilled") {
          setCategories(categoriesRes.value.data || categoriesRes.value || []);
        } else {
          toast.error("Failed to load categories");
        }

        if (coursesRes.status === "fulfilled") {
          setCourses(coursesRes.value.data || coursesRes.value || []);
        } else {
          toast.error("Failed to load courses");
        }

        if (usersRes.status === "fulfilled") {
          setUsers(usersRes.value.data || usersRes.value || []);
        } else {
          toast.error("Failed to load users");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("System Error: Data fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = courses.reduce(
    (acc, course) =>
      acc +
      (course.directPayments || []).reduce(
        (acc2, payment) => acc2 + payment.paymentAmount,
        0
      ),
    0
  );

  const stats = [
    {
      label: "Categories",
      value: categories.length,
      icon: <FaLayerGroup />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      link: "/admin/categories",
    },
    {
      label: "Total Courses",
      value: courses.length,
      icon: <FaBook />,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      link: "/admin/services",
    },
    {
      label: "Active Users",
      value: users.length,
      icon: <FaUsers />,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      link: "/admin/users",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      color: "text-[#F47C26]",
      bg: "bg-[#F47C26]/10",
      border: "border-[#F47C26]/20",
      link: "/admin/payments",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Ambience (Localized to content area) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F47C26]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
              Dashboard <span className="text-[#F47C26]">Overview</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              System metrics and quick controls.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wide border border-green-200 dark:border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Operational
            </span>
          </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={() => navigate(stat.link)}
              className={`cursor-pointer group relative overflow-hidden bg-white dark:bg-white/5 backdrop-blur-md border ${stat.border} p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:shadow-none`}
            >
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.bg} ${stat.color} text-xl group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>
              </div>
              {/* Hover Glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-transparent to-${
                  stat.color.split("-")[1]
                }-500`}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* --- Analytics Diagram --- */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaChartLine className="text-[#F47C26]" /> Platform Analytics
              </h3>
              <select className="bg-gray-50 dark:bg-white/5 border-none text-xs rounded-lg px-3 py-1 text-gray-500 cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="aspect-[2/1] w-full bg-gray-50 dark:bg-black/20 rounded-xl border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center text-xs text-gray-400"></div>
          </div>

          {/* --- Quick Actions --- */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">
              Quick Commands
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/admin/services/new")}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-200 dark:bg-indigo-500/30 rounded-lg text-indigo-700 dark:text-indigo-300">
                    <FaPlus size={12} />
                  </div>
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100 text-sm">
                    New Course
                  </span>
                </div>
                <FaArrowRight className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 text-xs" />
              </button>

              <button
                onClick={() => navigate("/admin/categories/new")}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-200 dark:bg-green-500/30 rounded-lg text-green-700 dark:text-green-300">
                    <FaLayerGroup size={12} />
                  </div>
                  <span className="font-semibold text-green-900 dark:text-green-100 text-sm">
                    New Category
                  </span>
                </div>
                <FaArrowRight className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 text-xs" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
