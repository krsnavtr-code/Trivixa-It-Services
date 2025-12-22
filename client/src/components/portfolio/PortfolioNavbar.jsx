import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaCode, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const PortfolioNavbar = ({ baseUrl = "/portfolio" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Using the theme hook
  const { theme, toggleTheme } = useTheme();

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { to: `/`, label: "Home" },
    { to: `/projects`, label: "Projects" },
    { to: `/about`, label: "About" },
    { to: `/contact`, label: "Contact" },
  ];

  // Helper to check active state
  const isActiveLink = (path) => {
    if (path === baseUrl || path === `${baseUrl}/`) {
      return location.pathname === path || location.pathname === `${path}`;
    }
    return location.pathname === path;
  };

  // --- Dynamic Styles based on Theme ---
  const headerBg = isScrolled
    ? theme === "dark"
      ? "bg-[#05081a]/90 border-white/5 shadow-lg"
      : "bg-white/90 border-gray-200 shadow-sm"
    : "bg-transparent border-transparent";

  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const subTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const mobileBg =
    theme === "dark"
      ? "bg-[#05081a] border-white/10"
      : "bg-white border-gray-200";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${headerBg} py-3`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* --- Logo --- */}
          <Link
            to="/"
            className={`group flex items-center gap-2 text-2xl font-black tracking-tight ${textColor}`}
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F47C26] to-purple-600 flex items-center justify-center text-white text-sm shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <FaCode />
            </span>
            <span>
              PORT<span className="text-[#F47C26]">FOLIO</span>.
            </span>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const active = isActiveLink(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative text-sm font-bold uppercase tracking-wide transition-colors ${
                    active ? textColor : `${subTextColor} hover:text-[#F47C26]`
                  }`}
                >
                  {item.label}

                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="portfolio-nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#F47C26] shadow-[0_0_10px_#F47C26]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors border ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                  : "bg-gray-100 border-gray-200 text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <FaMoon className="w-4 h-4" />
              ) : (
                <FaSun className="w-4 h-4" />
              )}
            </button>

            {/* CTA Button */}
            <Link
              to={`/contact`}
              className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all shadow-lg ${
                theme === "dark"
                  ? "bg-white/5 border-white/10 text-white hover:bg-[#F47C26] hover:border-[#F47C26]"
                  : "bg-gray-900 border-gray-900 text-white hover:bg-[#F47C26] hover:border-[#F47C26]"
              }`}
            >
              Hire Me
            </Link>
          </nav>

          {/* --- Mobile Menu Button --- */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Navigation Drawer --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b overflow-hidden ${mobileBg}`}
          >
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => {
                const active = isActiveLink(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block text-lg font-bold transition-colors ${
                      active
                        ? "text-[#F47C26]"
                        : `${subTextColor} hover:text-[#F47C26]`
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div
                className={`pt-4 border-t space-y-4 ${
                  theme === "dark" ? "border-white/10" : "border-gray-200"
                }`}
              >
                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-gray-300"
                      : "bg-gray-100 border-gray-200 text-gray-700"
                  }`}
                >
                  {theme === "light" ? <FaMoon /> : <FaSun />}
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>

                <Link
                  to={`/contact`}
                  className="block w-full py-3 text-center rounded-xl bg-[#F47C26] text-white font-bold shadow-lg"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PortfolioNavbar;
