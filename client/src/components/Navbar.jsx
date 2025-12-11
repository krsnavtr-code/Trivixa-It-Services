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
import { toast } from "react-hot-toast";
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

  // Theme State
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark" // Default to dark for Trivixa theme
  );

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

  // --- Search Logic (Preserved) ---
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
          params: { search: trimmedQuery, limit: 5 }, // Limit 5 for cleaner UI
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
      // Close Search
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        if (!event.target.closest(".search-toggle-btn")) setIsSearchOpen(false);
      }

      // Close Profile Menu
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
            ? "bg-[#fff] dark:bg-[#05081a]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link to="/" className="group flex items-center gap-2">
                <div className="relative">
                  {/* Fallback to text if image fails or for SEO, though you use image */}
                  <img
                    src="/images/trivixa-fix-size-brand-logo.png"
                    alt="Trivixa"
                    className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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
                    : "text-gray-300"
                }`}
              >
                Home
              </Link>

              {/* Course Menu Wrapper to Apply Styles */}
              <div className="course-menu-wrapper text-gray-300 hover:text-white">
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
                      : "text-gray-300 "
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
                        className="w-full h-10 pl-4 pr-10 bg-white/5 border border-white/10 rounded-full text-sm text-white focus:outline-none focus:border-[#F47C26] transition-all"
                        placeholder="Search..."
                      />
                      <button
                        type="button"
                        onClick={resetSearch}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                      >
                        <FaTimes />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="search-toggle-btn w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:text-[#F47C26] hover:bg-white/5 transition-all"
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
                      className="absolute right-0 top-14 w-80 bg-[#0a0f2d] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-white/10 bg-white/5">
                        <p className="text-xs font-bold text-[#F47C26] uppercase tracking-wider">
                          Results
                        </p>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {isSearching ? (
                          <div className="p-6 text-center text-gray-400 text-sm">
                            Searching...
                          </div>
                        ) : searchResults.courses.length === 0 ? (
                          <div className="p-6 text-center text-gray-400 text-sm">
                            No results found
                          </div>
                        ) : (
                          searchResults.courses.map((course) => (
                            <button
                              key={course._id}
                              onClick={() => handleResultClick(course)}
                              className="w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
                            >
                              <h4 className="text-sm font-semibold text-white group-hover:text-[#F47C26] transition-colors line-clamp-1">
                                {course.title}
                              </h4>
                              {course.category && (
                                <span className="text-xs text-gray-500">
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

              {/* Theme Toggle (Styled) */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:bg-white/5 hover:text-yellow-400 transition-all"
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
                      <div className="w-full h-full rounded-full bg-[#05081a] flex items-center justify-center">
                        <span className="font-bold text-white text-sm">
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
                        className="absolute right-0 top-14 w-64 bg-[#0a0f2d] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-white/10 bg-white/5">
                          <p className="text-white font-semibold truncate">
                            {authUser?.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {authUser?.email}
                          </p>

                          {/* Verification Badge */}
                          <div
                            className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                              isApproved
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
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
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <FaUser className="text-[#F47C26]" /> Profile
                          </Link>
                          <Link
                            to="/my-learning"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
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
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                className="lg:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
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
            className="fixed inset-0 z-40 lg:hidden bg-[#05081a] pt-24 pb-6 px-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-white border-b border-white/10 pb-2"
              >
                Home
              </Link>
              <div className="text-gray-300 border-b border-white/10 pb-2">
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
                  className="flex items-center justify-between text-lg font-medium text-gray-300 hover:text-[#F47C26] border-b border-white/10 pb-2 transition-colors"
                >
                  {item.label} <FaChevronRight className="text-xs opacity-50" />
                </Link>
              ))}

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#F47C26] text-white font-bold rounded-xl"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <PaymentForm onClose={() => setShowPaymentForm(false)} />
        </div>
      )}
    </>
  );
}

export default Navbar;
