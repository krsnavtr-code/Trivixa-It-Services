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

  // Theme State - Default to 'light' or 'dark' based on system or local storage
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
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
        console.error("Search error:", error);
        handleClientSideSearch(trimmedQuery);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleClientSideSearch = async (query) => {
    try {
      const response = await api.get("/courses", { params: { limit: 20 } });
      const allCourses = Array.isArray(response?.data)
        ? response?.data
        : response?.data?.data || [];
      const searchLower = query.toLowerCase();
      const filtered = allCourses.filter(
        (course) =>
          course?.title?.toLowerCase().includes(searchLower) ||
          course?.category?.name?.toLowerCase().includes(searchLower)
      );
      setSearchResults({ courses: filtered, categories: [] });
    } catch (error) {
      setSearchResults({ courses: [], categories: [] });
    }
  };

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
      resetSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults({ courses: [], categories: [] });
    setShowResults(false);
    setIsSearchOpen(false);
  };

  // --- Click Outside Handlers ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        if (!event.target.closest(".search-toggle-btn")) setIsSearchOpen(false);
      }
      if (!event.target.closest(".profile-menu-container")) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  // --- Navigation Data ---
  const navItems = [
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-[#05081a]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg dark:shadow-black/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link to="/" className="group flex items-center gap-2">
                <div className="relative">
                  <img
                    src="/images/trivixa-fix-size-brand-logo.png"
                    alt="Trivixa"
                    className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-[8px] border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className={`hover-underline px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  location.pathname === "/"
                    ? "text-[#F47C26]"
                    : "text-gray-700 dark:text-gray-200 hover:text-[#F47C26] dark:hover:text-[#F47C26]"
                }`}
              >
                Home
              </Link>

              {/* Course Menu Wrapper */}
              <div className="course-menu-wrapper text-gray-700 dark:text-white">
                <CourseMenu />
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`hover-underline px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    item.isPrimary
                      ? "text-[#F47C26] bg-[#F47C26]/10 border border-[#F47C26]/20 hover:bg-[#F47C26] hover:text-white"
                      : location.pathname === item.to
                      ? "text-[#F47C26]"
                      : "text-gray-700 dark:text-gray-200 hover:text-[#F47C26] dark:hover:text-[#F47C26]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative" ref={searchRef}>
                <div
                  className={`flex items-center transition-all duration-300 ${
                    isSearchOpen ? "w-64" : "w-10"
                  }`}
                >
                  {isSearchOpen ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(searchQuery);
                      }}
                      className="w-full relative"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowResults(true)}
                        className="w-full h-10 pl-4 pr-10 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all"
                        placeholder="Search..."
                      />
                      <button
                        type="button"
                        onClick={resetSearch}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                      >
                        <FaTimes />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="search-toggle-btn w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#F47C26] transition-all"
                    >
                      <FaSearch />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-14 w-80 bg-white dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                        <p className="text-xs font-bold text-[#F47C26] uppercase tracking-wider">
                          Results
                        </p>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {isSearching ? (
                          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                            Searching...
                          </div>
                        ) : searchResults.courses.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                            No results found
                          </div>
                        ) : (
                          searchResults.courses.map((course) => (
                            <button
                              key={course._id}
                              onClick={() => handleResultClick(course)}
                              className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 group"
                            >
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors line-clamp-1">
                                {course.title}
                              </h4>
                              {course.category && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {course.category.name}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all"
              >
                {theme === "dark" ? <FiMoon /> : <FiSun />}
              </button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F47C26] to-purple-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#05081a] flex items-center justify-center">
                        <span className="font-bold text-gray-800 dark:text-white text-sm uppercase">
                          {authUser?.name?.charAt(0) || <FaUser />}
                        </span>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-14 w-64 bg-white dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                          <p className="text-gray-900 dark:text-white font-semibold truncate">
                            {authUser?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {authUser?.email}
                          </p>

                          {/* Verification Badge */}
                          <div
                            className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                              isApproved
                                ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                                : "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
                            }`}
                          >
                            {isApproved ? (
                              <FaCheck className="text-[10px]" />
                            ) : (
                              <FaExclamationCircle className="text-[10px]" />
                            )}
                            {isApproved
                              ? "Verified Account"
                              : "Pending Approval"}
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <FaUser className="text-[#F47C26]" /> Profile
                          </Link>
                          <Link
                            to="/my-learning"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <FaGraduationCap className="text-[#F47C26]" /> My
                            Learning
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileMenuOpen(false);
                              navigate("/");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white text-sm font-bold rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FaSignInAlt /> Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-white dark:bg-[#05081a] pt-24 pb-6 px-6 overflow-y-auto shadow-2xl"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2"
              >
                Home
              </Link>
              <div className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-white/10 pb-2">
                <CourseMenu
                  isMobile={true}
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-[#F47C26] dark:hover:text-[#F47C26] border-b border-gray-200 dark:border-white/10 pb-2 transition-colors"
                >
                  {item.label} <FaChevronRight className="text-xs opacity-50" />
                </Link>
              ))}

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#F47C26] text-white font-bold rounded-xl shadow-lg"
                >
                  <FaSignInAlt /> Login Now
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm">
          <PaymentForm onClose={() => setShowPaymentForm(false)} />
        </div>
      )}
    </>
  );
}

export default Navbar;
