import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaTachometerAlt,
  FaBook,
  FaPaperPlane,
  FaFileContract,
  FaUsers,
  FaList,
  FaBlog,
  FaAddressBook,
  FaCreditCard,
  FaGraduationCap,
  FaQuestionCircle,
  FaImages,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
  FaChevronRight,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// --- Configuration ---

// Define roles for granular access (Optional: implies 'all' if undefined)
const NAV_ITEMS = [
  {
    category: "Overview",
    items: [
      {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: <FaTachometerAlt />,
        activePaths: ["/admin/dashboard"],
      },
    ],
  },
  {
    category: "Content & Products",
    items: [
      {
        path: "/admin/categories",
        label: "Categories",
        icon: <FaList />,
        activePaths: ["/admin/categories"],
      },
      {
        path: "/admin/subcategories",
        label: "Sub Categories",
        icon: <FaList />,
        activePaths: ["/admin/subcategories"],
      },
      {
        path: "/admin/projects",
        label: "Projects",
        icon: <FaList />,
        activePaths: ["/admin/projects"],
      },
      {
        path: "/admin/blog",
        label: "Blog",
        icon: <FaBlog />,
        activePaths: ["/admin/blog"],
      },
      {
        path: "/admin/media-gallery",
        label: "Media Gallery",
        icon: <FaImages />,
        activePaths: ["/admin/media-gallery"],
      },
    ],
  },
  {
    category: "CRM & Sales",
    items: [
      {
        path: "/admin/inquiries",
        label: "Inquiries",
        icon: <FaUsers />,
        activePaths: ["/admin/inquiries"],
      },
      {
        path: "/admin/mail-sender",
        label: "Mail Sender",
        icon: <FaPaperPlane />,
        activePaths: ["/admin/mail-sender"],
      },
    ],
  },
  {
    category: "Finance & Users",
    items: [
      {
        path: "/admin/payments",
        label: "Payments",
        icon: <FaCreditCard />,
        activePaths: ["/admin/payments"],
      },
      {
        path: "/admin/users",
        label: "User",
        icon: <FaUserShield />,
        activePaths: ["/admin/users"],
      },
      {
        path: "/admin/faqs",
        label: "FAQs",
        icon: <FaQuestionCircle />,
        activePaths: ["/admin/faqs"],
      },
    ],
  },
];

const AdminLayout = () => {
  const { currentUser, isAuthenticated, loading, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();
  const location = useLocation();

  // Responsive State
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Close sidebar when clicking on a link in mobile view
  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // --- Theme Effect ---
  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // --- Render Loading ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  // --- Render Access Denied ---
  if (!currentUser || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0f2d] p-6">
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-red-200 dark:border-red-500/30 p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <FaUserShield className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <Link
            to="/login"
            className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Authenticate
          </Link>
        </div>
      </div>
    );
  }

  const userRole = currentUser?.role || "admin"; // Default to admin

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#05081a] flex transition-colors duration-500 overflow-hidden relative">
      {/* --- Mobile Backdrop --- */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* --- Sidebar (Command Center) --- */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#0a0f2d] border-r border-gray-200 dark:border-white/10 flex flex-col z-50 transition-all duration-300 shadow-2xl
          ${
            isSidebarOpen
              ? "w-52 translate-x-0"
              : isMobile
              ? "-translate-x-full w-52"
              : "w-16 translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5 shrink-0">
          <div
            className={`flex items-center gap-2 ${
              !isSidebarOpen && !isMobile && "mx-auto"
            }`}
          >
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#F47C26] to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
              T
            </div>
            {(isSidebarOpen || isMobile) && (
              <span className="font-bold text-gray-800 dark:text-white tracking-wide text-lg">
                Admin<span className="text-[#F47C26]">OS</span>
              </span>
            )}
          </div>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* User Profile Snippet */}
        <div
          className={`px-6 py-2 border-b border-gray-100 dark:border-white/5 shrink-0 ${
            !isSidebarOpen && !isMobile && "flex flex-col items-center p-4"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-500 dark:text-gray-300 shrink-0">
              {currentUser?.fullname?.charAt(0) || "A"}
            </div>
            {(isSidebarOpen || isMobile) && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {currentUser?.fullname}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {userRole}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {NAV_ITEMS.map((group, groupIdx) => (
            <div key={groupIdx}>
              {(isSidebarOpen || isMobile) && (
                <h3 className="px-3 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {group.category}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  // Role Check
                  if (item.roles && !item.roles.includes(userRole)) return null;

                  const isActive = item.activePaths
                    ? item.activePaths.some((path) =>
                        location.pathname.startsWith(path)
                      )
                    : location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                          isActive
                            ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/20"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#F47C26] dark:hover:text-white"
                        }`}
                        title={!isSidebarOpen && !isMobile ? item.label : ""}
                      >
                        <span
                          className={`text-lg shrink-0 ${
                            !isSidebarOpen && !isMobile && "mx-auto"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {(isSidebarOpen || isMobile) && (
                          <>
                            <span className="text-sm font-medium flex-1">
                              {item.label}
                            </span>
                            {isActive && (
                              <FaChevronRight className="text-[10px] opacity-80" />
                            )}
                          </>
                        )}
                        {!isSidebarOpen && !isMobile && isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="px-4 py-1 border-t border-gray-100 dark:border-white/5 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ${
              !isSidebarOpen && !isMobile && "justify-center"
            }`}
          >
            <FaSignOutAlt className="text-lg shrink-0" />
            {(isSidebarOpen || isMobile) && (
              <span className="font-bold text-sm">System Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${
          isSidebarOpen && !isMobile ? "ml-52" : !isMobile ? "ml-20" : ""
        }`}
      >
        {/* Top Bar */}
        <div className="h-12 bg-white/80 dark:bg-[#05081a]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-gray-500 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <FaBars size={20} />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Online &bull;{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* System Context Trigger */}
          <div className="hidden md:block group relative">
            <div className="cursor-help opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5">
              Currently working on
              <div className="w-1.5 h-1.5 rounded-full bg-[#F47C26] animate-pulse"></div>
              <span className="font-bold text-[#F47C26]">
                {location.pathname.split("/").pop().replace(/-/g, " ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#0B2545] dark:text-white hover:bg-[#0B2545]/5 dark:hover:bg-white/10 transition-all active:scale-95"
            >
              {theme === "dark" ? <FaMoon /> : <FaSun />}
            </button>

            {/* --- Mobile Toggle Button --- */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Content Outlet */}
        <div className="p-4 md:p-8 relative z-10 w-full max-w-[1920px] mx-auto">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
