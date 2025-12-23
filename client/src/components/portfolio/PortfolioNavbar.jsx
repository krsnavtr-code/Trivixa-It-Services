import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaCode, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const PortfolioNavbar = ({ baseUrl = "/portfolio" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { to: `/`, label: "Home" },
    { to: `/projects`, label: "Work" },
    { to: `/about`, label: "About" },
    { to: `/contact`, label: "Contact" },
  ];

  const isActiveLink = (path) => {
    if (path === baseUrl || path === `${baseUrl}/`) {
      return location.pathname === path || location.pathname === `${path}`;
    }
    return location.pathname === path;
  };

  // --- THEME CONFIGURATION ---

  // Your Color: #074F3E (Deep Emerald)
  // We use this for Borders, Buttons, and Accents
  const primaryBrandColor = "#074F3E";

  // We need a lighter green for Text visibility on dark backgrounds
  const textHighlight = "text-[#34d399]";

  // Dark Mode Background: We go darker than #074F3E for the main bg to create contrast
  const darkBg = `bg-[#020e0a]/90 border-[#074F3E]/50 shadow-2xl shadow-[#074F3E]/20`;
  const lightBg = "bg-white/90 border-gray-200 shadow-sm";

  const headerClasses = isScrolled
    ? theme === "dark"
      ? `${darkBg} backdrop-blur-xl`
      : `${lightBg} backdrop-blur-xl`
    : "bg-transparent border-transparent backdrop-blur-sm";

  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const subTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${headerClasses} py-4`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* --- Logo --- */}
          <Link
            to="/"
            className={`group flex items-center gap-2.5 text-xl font-bold tracking-tight ${textColor}`}
          >
            {/* Logo Box */}
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105 overflow-hidden`}
            >
              {/* Using your color in the gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-[#074F3E] to-[#10b981]`}
              />
              <FaCode className="relative z-10 text-sm" />
            </div>

            <span className="hidden sm:block">
              KRISHNA<span className={textHighlight}>.portfolio</span>
            </span>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-full px-2 py-1.5 border border-transparent dark:border-[#074F3E]/30 backdrop-blur-sm">
            {navItems.map((item) => {
              const active = isActiveLink(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    active
                      ? theme === "dark"
                        ? "text-white"
                        : "text-[#074F3E]"
                      : subTextColor
                  } hover:${textHighlight} hover:bg-white/5`}
                >
                  {/* Active Pill using your color */}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        theme === "dark"
                          ? `bg-[#074F3E] shadow-[0_0_10px_#074F3E]` // Glowing effect
                          : "bg-white shadow-gray-200"
                      }`}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* --- Actions --- */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 border ${
                theme === "dark"
                  ? "bg-[#074F3E]/20 border-[#074F3E] text-[#34d399] hover:bg-[#074F3E]/40"
                  : "bg-gray-100 border-gray-200 text-slate-600 hover:bg-gray-200"
              }`}
            >
              {theme === "light" ? <FaMoon size={14} /> : <FaSun size={14} />}
            </button>

            {/* Hire Me Button - Using your exact color */}
            <Link
              to="/contact"
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 border shadow-lg ${
                theme === "dark"
                  ? `bg-[#074F3E] border-[#074F3E] text-white hover:bg-[#0a6650] hover:shadow-[0_0_20px_#074F3E]`
                  : `bg-[#074F3E] border-[#074F3E] text-white hover:bg-[#0a6650]`
              }`}
            >
              Hire Me
            </Link>
          </div>

          {/* --- Mobile Menu Button --- */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Drawer --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden border-b ${
              theme === "dark"
                ? "bg-[#020e0a] border-[#074F3E]/30" // Deep bg with your border color
                : "bg-white border-gray-100"
            }`}
          >
            <div className="p-6 space-y-6">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const active = isActiveLink(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`text-2xl font-bold tracking-tight ${
                        active ? textHighlight : subTextColor
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#074F3E] to-transparent opacity-50" />

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={toggleTheme}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${
                    theme === "dark"
                      ? "bg-[#074F3E]/10 border-[#074F3E]/50 text-[#34d399]"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  {theme === "light" ? <FaMoon /> : <FaSun />}
                  <span>{theme === "light" ? "Dark" : "Light"}</span>
                </button>

                <Link
                  to="/contact"
                  className={`flex-1 py-3 text-center rounded-xl text-white font-bold shadow-lg transition-colors bg-[#074F3E] hover:bg-[#0a6650]`}
                >
                  Let's Talk
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
