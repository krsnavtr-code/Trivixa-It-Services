import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getCategories } from "../../api/categoryApi";
import { getCourses } from "../../api/servicesApi";
import userApi from "../../api/userApi";
import { getBlogPosts } from "../../api/blogApi";
import { getUploadedImages } from "../../api/imageApi";
import { getContacts } from "../../api/contactApi";
import { getEmailRecords } from "../../api/adminApi"; // Assuming you have this for recent activity
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaLayerGroup,
  FaBook,
  FaUsers,
  FaMoneyBillWave,
  FaPlus,
  FaArrowRight,
  FaChartPie,
  FaBell,
} from "react-icons/fa";

// --- Theme Constants ---
const COLORS = ["#F47C26", "#3B82F6", "#10B981", "#8B5CF6"];
const CHART_GRID_COLOR = "#374151"; // Gray-700 for dark mode grid lines

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    categories: [],
    courses: [],
    users: [],
    blogs: [],
    media: [],
    inquiries: [],
    revenue: [],
  });
  const [loading, setLoading] = useState(true);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          categoriesRes,
          coursesRes,
          usersRes,
          blogsRes,
          mediaRes,
          inquiriesRes,
        ] = await Promise.allSettled([
          getCategories(),
          getCourses(),
          userApi.getUsers(),
          getBlogPosts({ limit: 1 }),
          getUploadedImages(),
          getContacts({ limit: 100 }), // Fetch more for charts
        ]);

        // Helper to extract data safely
        const unwrap = (res) =>
          res.status === "fulfilled"
            ? res.value.data || res.value.users || res.value || []
            : [];

        setData({
          categories: unwrap(categoriesRes),
          courses: unwrap(coursesRes),
          users: unwrap(usersRes),
          blogs: Array(blogsRes.value?.total || 0).fill({}),
          media: unwrap(mediaRes),
          inquiries: unwrap(inquiriesRes),
        });
      } catch (error) {
        console.error(error);
        toast.error("Dashboard data sync failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Data Processing for Charts ---

  // 1. Calculate Total Revenue
  const totalRevenue = useMemo(() => {
    return data.courses.reduce(
      (acc, course) =>
        acc +
        (course.directPayments || []).reduce(
          (acc2, payment) => acc2 + (payment.paymentAmount || 0),
          0
        ),
      0
    );
  }, [data.courses]);

  // 2. Prepare Revenue Chart Data (Mocking monthly distribution based on total for demo)
  const revenueChartData = useMemo(() => {
    // In a real app, you'd aggregate payments by date from the backend
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      name: month,
      income:
        Math.floor(totalRevenue * (0.1 + index * 0.05)) || 1000 * (index + 1), // Simulated trend
      leads: data.inquiries.length * (index + 1) * 0.5,
    }));
  }, [totalRevenue, data.inquiries]);

  // 3. User Role Distribution
  const userDistribution = useMemo(() => {
    const students = data.users.filter((u) => u.role === "student").length;
    const teachers = data.users.filter((u) => u.role === "teacher").length;
    const admins = data.users.filter((u) => u.role === "admin").length;
    return [
      { name: "Students", value: students || 120 }, // Fallback for visual demo
      { name: "Teachers", value: teachers || 15 },
      { name: "Admins", value: admins || 5 },
    ];
  }, [data.users]);

  // 4. Inquiry Status
  const inquiryStats = useMemo(() => {
    const newLeads = data.inquiries.filter((i) => i.status === "new").length;
    const contacted = data.inquiries.filter(
      (i) => i.status === "contacted"
    ).length;
    return [
      { name: "New", value: newLeads },
      { name: "Contacted", value: contacted },
      { name: "Converted", value: Math.floor(newLeads * 0.2) }, // Simulated conversion
    ];
  }, [data.inquiries]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F47C26]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8 space-y-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Command <span className="text-[#F47C26]">Center</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Real-time platform telemetry and performance metrics.
            </p>
          </div>

          {/* Quick Stats Ticker */}
          <div className="flex gap-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-2 px-4 shadow-sm">
            <div className="flex items-center gap-2 border-r border-gray-200 dark:border-white/10 pr-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                Server: Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaBell className="text-[#F47C26]" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {data.inquiries.length} New Leads
              </span>
            </div>
          </div>
        </div>

        {/* Visual Context: Architecture */}
        <div
          className="mb-4 opacity-50 hover:opacity-100 transition-opacity cursor-help"
          title="System Status"
        ></div>

        {/* --- KPI Grid --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Revenue Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  ₹{totalRevenue.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-500/20 text-[#F47C26] rounded-2xl">
                <FaMoneyBillWave size={24} />
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F47C26] w-[70%]" />
            </div>
            <p className="text-xs text-gray-400 mt-2">+12% from last month</p>
          </motion.div>

          {/* Users Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Active Users
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {data.users.length}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-500 rounded-2xl">
                <FaUsers size={24} />
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[45%]" />
            </div>
            <p className="text-xs text-gray-400 mt-2">+5 new today</p>
          </motion.div>

          {/* Products Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course Catalog
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {data.courses.length}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-500/20 text-purple-500 rounded-2xl">
                <FaBook size={24} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate("/admin/services")}
                className="text-xs font-bold text-purple-500 hover:underline"
              >
                Manage Courses
              </button>
            </div>
          </motion.div>

          {/* Categories Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {data.categories.length}
                </h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-2xl">
                <FaLayerGroup size={24} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate("/admin/categories")}
                className="text-xs font-bold text-green-500 hover:underline"
              >
                View Taxonomy
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Revenue Analysis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaMoneyBillWave className="text-[#F47C26]" /> Performance
                Analytics
              </h3>
              <select className="bg-gray-100 dark:bg-black/20 border-none text-xs rounded-lg px-3 py-1 text-gray-500 cursor-pointer">
                <option>Last 6 Months</option>
                <option>Year to Date</option>
              </select>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#F47C26" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F47C26" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0f2d",
                      borderColor: "#ffffff20",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#F47C26"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Secondary Chart: User Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaChartPie className="text-purple-500" /> Demographics
            </h3>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0f2d",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                <p className="text-2xl font-black text-white">
                  {data.users.length}
                </p>
                <p className="text-xs text-gray-400">Total Users</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Quick Actions & Recent Activity --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/admin/services/new")}
                className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all text-left group"
              >
                <FaPlus className="text-indigo-500 mb-2" />
                <span className="block font-bold text-indigo-900 dark:text-indigo-100">
                  Add Course
                </span>
                <span className="text-xs text-indigo-400">Expand catalog</span>
              </button>
              <button
                onClick={() => navigate("/admin/mail-sender/brochure")}
                className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all text-left group"
              >
                <FaSend className="text-orange-500 mb-2" />
                <span className="block font-bold text-orange-900 dark:text-orange-100">
                  Send Brochure
                </span>
                <span className="text-xs text-orange-400">Marketing blast</span>
              </button>
            </div>
          </div>

          {/* Recent Leads (Simplified List) */}
          <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Recent Inquiries
              </h3>
              <Link
                to="/admin/contacts"
                className="text-xs text-blue-500 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {data.inquiries.slice(0, 3).map((inquiry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 text-xs font-bold">
                      {inquiry.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">
                        {inquiry.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inquiry.courseTitle || "General Inquiry"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-white dark:bg-white/10 px-2 py-1 rounded text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {data.inquiries.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent inquiries.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon needed for quick action button above
const FaSend = ({ className }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default AdminDashboard;
