import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaSearch,
  FaUser,
  FaTimes,
  FaBars,
  FaSignInAlt,
  FaChevronRight,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import CourseMenu from "./CourseMenu";
import { debounce } from "lodash";
import api from "../api/axios";
import PaymentForm from "./PaymentForm";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../context/ChatContext";

function Navbar() {
  const { authUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const navbarRef = useRef(null);

  // Chat Bot AI
  const { openChat } = useChat();

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const navigate = useNavigate();
  const location = useLocation();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    projects: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // --- Handlers ---
  const handleQuoteClick = (e, to) => {
    // If it's an external link (starts with http), let default behavior happen (don't preventDefault)
    if (to.startsWith("http")) {
      setIsMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile menu if open

    if (to === "/get-quote") {
      openChat();
    } else {
      navigate(to);
    }
  };

  // --- Effects ---
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Navbar background / shadow state
      setIsScrolled(currentScrollY > 10);

      // Show / hide navbar logic
      if (currentScrollY < 100) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- Search Logic ---
  const handleSearch = useCallback(
    debounce(async (query) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSearchResults({ projects: [], categories: [] });
        return;
      }
      try {
        setIsSearching(true);
        const response = await api.get("/projects", {
          params: { search: trimmedQuery, limit: 5 },
        });
        const projects = response?.data?.data || response?.data || [];
        setSearchResults({
          projects: Array.isArray(projects) ? projects : [],
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
    const projectSlug = item.slug;
    if (projectSlug) {
      navigate(`/services/${projectSlug}`);
      setSearchQuery("");
      setShowResults(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Click Outside Listener
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

  // --- Data ---
  const topNavItems = [
    { to: "/get-quote", label: "Get Quote" },
    // { to: "/products", label: "Products" },
    { to: "/we-serve", label: "We Served" },
    { to: "https://portfolio.trivixa.in", label: "Portfolio" },
    // { to: "https://parlour.trivixa.in", label: "Parlour" },
  ];

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/categories", label: "Categories" },
    { to: "/web-services", label: "Web" },
    { to: "/android-services", label: "Android" },
    { to: "/digital-marketing", label: "Digital Marketing" },
    { to: "/technologies", label: "Technologies" },
    // { to: "/free-courses", label: "Free Resources" },
    { to: "/packages", label: "Pricing" },
    ...(isAdmin
      ? [{ to: "/admin", label: "Admin Panel", isPrimary: true }]
      : []),
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* =================================================================================
            PART 1: TOP COMMAND BAR 
           ================================================================================= */}

        <div
          className={`bg-white dark:bg-[#0B2545] border-b border-gray-200 dark:border-white/10 relative z-50 transform transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            showNavbar ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between gap-4">
            {/* 1. Logo */}
            <Link
              to="/"
              className="flex-shrink-0 group flex items-center gap-2"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="/images/trivixa-fix-size-brand-logo.png"
                  alt="Trivixa IT Solutions – Web & Digital Services"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* 2. Desktop Search */}
            <div
              className="hidden lg:block flex-1 max-w-xl mx-auto relative z-50"
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
                  className="w-full h-10 pl-10 pr-4 bg-[#0B2545]/5 dark:bg-white/10 border border-transparent dark:border-white/10 rounded-xl text-sm text-[#0B2545] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-[#0B2545] focus:ring-2 focus:ring-[#F47C26]/50 focus:border-[#F47C26] transition-all duration-300 shadow-inner"
                  placeholder="Search projects..."
                />

                {/* Desktop Search Results Dropdown */}
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
                        ) : searchResults.projects.length === 0 ? (
                          <div className="p-4 text-center text-xs text-gray-500">
                            No projects found
                          </div>
                        ) : (
                          searchResults.projects.map((project) => (
                            <Link
                              key={project._id}
                              to={`/services/${project.slug}`}
                              className="block w-full text-left px-4 py-3 hover:bg-[#0B2545]/5 dark:hover:bg-white/10 flex items-center justify-between group transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                              onClick={() => {
                                setSearchQuery("");
                                setShowResults(false);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <div>
                                <h4 className="text-sm font-semibold text-[#0B2545] dark:text-white group-hover:text-[#F47C26] transition-colors line-clamp-1">
                                  {project.title}
                                </h4>
                                <span className="text-[10px] uppercase tracking-wide text-gray-500 group-hover:text-gray-400">
                                  {project.category?.name || "Project"}
                                </span>
                              </div>
                              <FaChevronRight className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                            </Link>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 3. Desktop Top Links */}
            <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-[#0B2545] dark:text-gray-300">
              {topNavItems.map((item) => {
                const isExternal = item.to.startsWith("http");
                const commonClasses =
                  "hover:text-[#F47C26] transition-colors relative group";

                if (isExternal) {
                  return (
                    <a
                      key={item.to}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={commonClasses}
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F47C26] transition-all group-hover:w-full"></span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={(e) => handleQuoteClick(e, item.to)}
                    className={commonClasses}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F47C26] transition-all group-hover:w-full"></span>
                  </Link>
                );
              })}
            </div>

            {/* 4. Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#0B2545] dark:text-white hover:bg-[#0B2545]/5 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                {theme === "dark" ? <FiMoon /> : <FiSun />}
              </button>

              {/* Desktop Auth */}
              {isAuthenticated ? (
                <div className="relative profile-menu-container z-50">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-[#0B2545]/5 dark:hover:bg-white/10 transition-all"
                  >
                    <span className="text-xs font-semibold text-[#0B2545] dark:text-white hidden sm:block max-w-[80px] truncate">
                      {authUser?.name?.split(" ")[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F47C26] to-[#0B2545] flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-[#0B2545]">
                      {(() => {
                        // If we have a full name, use that
                        if (authUser?.fullName) {
                          const nameParts = authUser.fullName
                            .trim()
                            .split(/\s+/);
                          if (nameParts.length > 1) {
                            return `${nameParts[0][0]}${
                              nameParts[nameParts.length - 1][0]
                            }`.toUpperCase();
                          }
                          return (
                            nameParts[0]?.slice(0, 2).toUpperCase() || "US"
                          );
                        }

                        // Fallback to email if no full name
                        return (
                          authUser?.email?.slice(0, 2) || "P"
                        ).toUpperCase();
                      })()}
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
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[#0B2545] dark:text-gray-300 hover:bg-[#0B2545]/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <FaUser className="text-[#F47C26]" /> Profile
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
                  className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[#F47C26] hover:bg-[#d5671f] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                >
                  <FaSignInAlt /> Login
                </Link>
              )}

              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-[#0B2545] dark:text-white hover:bg-[#0B2545]/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================================
            PART 2: BOTTOM NAV RAIL (Desktop Only >= 1024px)
           ================================================================================= */}
        <div
          className={`bg-white dark:bg-[#0B2545] transform will-change-transform transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            !showNavbar
              ? "fixed top-0 left-0 right-0 shadow-lg translate-y-0"
              : "relative translate-y-0"
          }`}
        >
          <div className="hidden lg:block relative">
            <div
              className={`w-full border-b border-gray-200 dark:border-white/5 transition-all duration-500 z-40 ${
                isScrolled
                  ? "bg-white/90 dark:bg-[#0B2545]/90 backdrop-blur-xl h-12 shadow-sm"
                  : "bg-white dark:bg-[#0B2545] h-12"
              }`}
            >
              <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-center">
                <nav
                  className="flex items-center gap-2"
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {/* Explore Dropdown */}
                  <div className="relative group px-4 py-1.5 cursor-pointer flex items-center gap-2 text-sm font-semibold text-[#0B2545] dark:text-white hover:text-[#F47C26] transition-colors border-r border-gray-200 dark:border-white/10 pr-6 mr-2">
                    <span className="w-2 h-2 rounded-full bg-[#F47C26] animate-pulse"></span>
                    Explore
                    <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-[60]">
                      <CourseMenu />
                    </div>
                  </div>

                  {/* Main Links */}
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onMouseEnter={() => setHoveredNav(item.to)}
                        className={`relative px-1 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg ${
                          isActive
                            ? "text-[#F47C26]"
                            : "text-[#0B2545] dark:text-gray-300 hover:text-[#F47C26] dark:hover:text-[#F47C26]"
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <motion.div
                            layoutId="active-dot"
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#F47C26] rounded-full"
                          />
                        )}
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
          </div>
        </div>
      </header>

      {/* =================================================================================
          PART 3: UNIFIED MOBILE DRAWER (All Links + Search)
         ================================================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-[#0B2545] lg:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100 dark:border-white/10">
              <span className="text-lg font-bold text-[#0B2545] dark:text-white">
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-600 dark:text-white"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
              {/* Mobile Search */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full h-12 pl-4 pr-12 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-xl text-[#0B2545] dark:text-white focus:outline-none focus:border-[#F47C26]"
                    placeholder="Search for anything..."
                  />
                  <FaSearch className="absolute right-4 top-4 text-gray-400" />
                </div>
                {/* Mobile Search Results */}
                {searchQuery.trim() && (
                  <div className="mt-2 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs text-gray-500">
                        Searching...
                      </div>
                    ) : searchResults.projects.length > 0 ? (
                      searchResults.projects.map((project) => (
                        <Link
                          key={project._id}
                          to={`/services/${project.slug}`}
                          className="block w-full text-left px-4 py-3 text-sm text-[#0B2545] dark:text-white border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-[#0B2545]/5 dark:hover:bg-white/10"
                          onClick={() => {
                            setSearchQuery("");
                            setShowResults(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-[#0B2545] dark:text-white line-clamp-1">
                                {project.title}
                              </h4>
                              {project.category?.name && (
                                <span className="text-[10px] uppercase tracking-wide text-gray-500">
                                  {project.category.name}
                                </span>
                              )}
                            </div>
                            <FaChevronRight className="text-[10px] text-gray-400" />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500">
                        No projects found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-6">
                {/* 1. Explore Accordion */}
                <div>
                  <button
                    onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                    className="flex items-center justify-between w-full text-lg font-bold text-[#0B2545] dark:text-white mb-2"
                  >
                    <span>Categories</span>
                    <FaChevronDown
                      className={`text-xs transition-transform ${
                        mobileCategoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileCategoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-2"
                      >
                        <CourseMenu
                          isMobile={true}
                          onItemClick={() => setIsMobileMenuOpen(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/10" />

                {/* 2. Main Navigation */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Main Menu
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between text-base font-medium text-[#0B2545] dark:text-gray-200 hover:text-[#F47C26] transition-colors"
                    >
                      {item.label}
                      <FaChevronRight className="text-xs text-gray-400 opacity-50" />
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/10" />

                {/* 3. Quick Links (Top Bar Items) - FIXED */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Quick Links
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {topNavItems.map((item) => {
                      const isExternal = item.to.startsWith("http");
                      const commonClasses =
                        "px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-sm text-[#0B2545] dark:text-gray-300 text-center block";

                      if (isExternal) {
                        return (
                          <a
                            key={item.to}
                            href={item.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={commonClasses}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={(e) => handleQuoteClick(e, item.to)}
                          className={commonClasses}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Mobile Auth */}
                {!isAuthenticated && (
                  <div className="pt-4">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F47C26] text-white font-bold rounded-xl shadow-lg"
                    >
                      <FaSignInAlt /> Login / Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal Overlay */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <PaymentForm onClose={() => setShowPaymentForm(false)} />
        </div>
      )}
    </>
  );
}

export default Navbar;
