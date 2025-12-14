import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSearch,
  FaUser,
  FaTimes,
  FaBars,
  FaSignInAlt,
  FaCheck,
  FaExclamationCircle,
  FaChevronRight,
  FaSignOutAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import CourseMenu from "./CourseMenu";
import { debounce } from "lodash";
import api from "../api/axios";
import PaymentForm from "./PaymentForm";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { authUser, isAuthenticated, isAdmin, isApproved, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const navigate = useNavigate();
  const location = useLocation();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    courses: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

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

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Search Logic ---
  const handleSearch = useCallback(
    debounce(async (query) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSearchResults({ courses: [], categories: [] });
        return;
      }
      try {
        setIsSearching(true);
        const response = await api.get("/courses", {
          params: { search: trimmedQuery, limit: 5 },
        });
        const courses = response?.data?.data || response?.data || [];
        setSearchResults({
          courses: Array.isArray(courses) ? courses : [],
          categories: [],
        });
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) handleSearch(query);
    else setSearchResults({ courses: [], categories: [] });
  };

  const handleResultClick = (item) => {
    const courseId = item.slug || item._id;
    if (courseId) {
      navigate(`/course/${courseId}`);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target))
        setShowResults(false);
      if (!event.target.closest(".profile-menu-container"))
        setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/free-courses", label: "Free Resources" },
    { to: "/contact", label: "Contact" },
    { to: "/blog", label: "Insights" },
    ...(isAdmin
      ? [{ to: "/admin", label: "Admin Panel", isPrimary: true }]
      : []),
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        {/* =================================================================================
            PART 1: TOP COMMAND BAR (Logo, Search, Auth)
            Colors: White (Light Mode) / #0B2545 (Dark Mode)
           ================================================================================= */}
        <div className="bg-white dark:bg-[#0B2545] border-b border-gray-200 dark:border-white/10 transition-colors duration-300 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 group flex items-center gap-2"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/images/trivixa-fix-size-brand-logo.png"
                  alt="Trivixa"
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Search Bar */}
            <div
              className="hidden md:block flex-1 max-w-xl mx-auto relative z-50"
              ref={searchRef}
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0B2545]/50 dark:text-white/50 group-focus-within:text-[#F47C26] transition-colors">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowResults(true)}
                  className="w-full h-9 pl-10 pr-4 bg-[#0B2545]/5 dark:bg-white/10 border border-transparent dark:border-white/10 rounded-xl text-sm text-[#0B2545] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-[#0B2545] focus:ring-2 focus:ring-[#F47C26]/50 focus:border-[#F47C26] transition-all duration-300 shadow-inner"
                  placeholder="Search..."
                />

                {/* Search Dropdown */}
                <AnimatePresence>
                  {showResults && searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute top-12 left-0 right-0 bg-white dark:bg-[#0B2545] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    >
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {isSearching ? (
                          <div className="p-4 text-center text-xs text-gray-500">
                            Searching...
                          </div>
                        ) : searchResults.courses.length === 0 ? (
                          <div className="p-4 text-center text-xs text-gray-500">
                            No results found
                          </div>
                        ) : (
                          searchResults.courses.map((course) => (
                            <button
                              key={course._id}
                              onClick={() => handleResultClick(course)}
                              className="w-full text-left px-4 py-3 hover:bg-[#0B2545]/5 dark:hover:bg-white/10 flex items-center justify-between group transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                            >
                              <div>
                                <h4 className="text-sm font-semibold text-[#0B2545] dark:text-white group-hover:text-[#F47C26] transition-colors line-clamp-1">
                                  {course.title}
                                </h4>
                                <span className="text-[10px] uppercase tracking-wide text-gray-500 group-hover:text-gray-400">
                                  {course.category?.name || "General"}
                                </span>
                              </div>
                              <FaChevronRight className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#0B2545] dark:text-white hover:bg-[#0B2545]/5 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                {theme === "dark" ? <FiMoon /> : <FiSun />}
              </button>

              {/* User Profile / Login */}
              {isAuthenticated ? (
                <div className="relative profile-menu-container z-50">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-gray-200 dark:border-white/10 hover:bg-[#0B2545]/5 dark:hover:bg-white/10 transition-all"
                  >
                    <span className="text-xs font-semibold text-[#0B2545] dark:text-white hidden sm:block max-w-[80px] truncate">
                      {authUser?.name?.split(" ")[0]}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F47C26] to-[#0B2545] flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {authUser?.name?.charAt(0)}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                        className="absolute right-0 top-12 w-64 bg-white dark:bg-[#0B2545] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-[70] overflow-hidden"
                      >
                        <div className="p-4 bg-[#0B2545]/5 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                          <p className="text-sm font-bold text-[#0B2545] dark:text-white truncate">
                            {authUser?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {authUser?.email}
                          </p>
                          <div
                            className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isApproved
                                ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
                            }`}
                          >
                            {isApproved ? <FaCheck /> : <FaExclamationCircle />}{" "}
                            {isApproved ? "Verified" : "Pending"}
                          </div>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#0B2545] dark:text-gray-300 hover:bg-[#0B2545]/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <FaUser className="text-[#F47C26]" /> Profile
                          </Link>
                          <Link
                            to="/my-learning"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#0B2545] dark:text-gray-300 hover:bg-[#0B2545]/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <FaGraduationCap className="text-[#F47C26]" /> My
                            Learning
                          </Link>
                          <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileMenuOpen(false);
                              navigate("/");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <FaSignOutAlt /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#F47C26] hover:bg-[#d5671f] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                >
                  <FaSignInAlt /> Login
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-[#0B2545] dark:text-white hover:bg-[#0B2545]/5 dark:hover:bg-white/10 rounded-lg"
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================================
            PART 2: BOTTOM NAV RAIL (Links)
            Colors: White (Light) / #0B2545 (Dark) with Brand Highlights
           ================================================================================= */}
        <div
          className={`hidden md:block w-full border-b border-gray-200 dark:border-white/5 transition-all duration-500 z-40 ${
            isScrolled
              ? "bg-white/80 dark:bg-[#0B2545]/80 backdrop-blur-xl h-10 rounded-b-[60%] overflow-hidden"
              : "bg-white dark:bg-[#0B2545] h-12"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
            <nav
              className="flex items-center gap-1 p-1 rounded-full"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {/* Category Dropdown Trigger */}
              <div className="relative group px-4 py-1.5 cursor-pointer flex items-center gap-2 text-sm font-semibold text-[#0B2545] dark:text-white hover:text-[#F47C26] transition-colors border-r border-gray-200 dark:border-white/10 pr-6 mr-2">
                <span className="w-2 h-2 rounded-full bg-[#F47C26] animate-pulse"></span>
                Explore
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <CourseMenu />
                </div>
              </div>

              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onMouseEnter={() => setHoveredNav(item.to)}
                    className={`relative px-3 py-1 text-sm font-medium transition-colors duration-200 z-10 ${
                      isActive
                        ? "text-[#F47C26]"
                        : "text-[#0B2545] dark:text-gray-300 hover:text-[#0B2545] dark:hover:text-white"
                    }`}
                  >
                    {item.label}

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-dot"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#F47C26] rounded-full mb-1"
                      />
                    )}

                    {/* Spotlight Hover Effect */}
                    {hoveredNav === item.to && (
                      <motion.div
                        layoutId="nav-spotlight"
                        className="absolute inset-0 bg-[#0B2545]/5 dark:bg-white/10 rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-[#0B2545] pt-20 px-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-6 mt-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-12 pl-4 pr-10 bg-[#0B2545]/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[#0B2545] dark:text-white focus:outline-none focus:border-[#F47C26]"
                  placeholder="Search courses..."
                />
                <FaSearch className="absolute right-4 top-4 text-gray-400" />
              </div>

              {/* Mobile Links */}
              <div className="space-y-1">
                <div className="pb-4 border-b border-gray-100 dark:border-white/10">
                  <div className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">
                    Categories
                  </div>
                  <CourseMenu
                    isMobile={true}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>

                <div className="pt-4">
                  <div className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-2">
                    Menu
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 text-lg font-medium text-[#0B2545] dark:text-gray-200 border-b border-gray-100 dark:border-white/5 last:border-0 hover:text-[#F47C26] transition-colors"
                    >
                      {item.label}{" "}
                      <FaChevronRight className="text-xs opacity-50" />
                    </Link>
                  ))}
                </div>
              </div>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F47C26] text-white font-bold rounded-xl shadow-lg"
                >
                  <FaSignInAlt /> Login / Register
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-white/10 rounded-full"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <PaymentForm onClose={() => setShowPaymentForm(false)} />
        </div>
      )}
    </>
  );
}

export default Navbar;
