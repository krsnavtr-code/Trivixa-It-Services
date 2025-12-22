import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaCode } from "react-icons/fa";

const PortfolioNavbar = ({ baseUrl = "/portfolio" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
    // Exact match for home, or starts with for others (to handle nested routes if any)
    if (path === baseUrl || path === `${baseUrl}/`) {
      return location.pathname === path || location.pathname === `${path}`;
    }
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#05081a]/90 backdrop-blur-md border-b border-white/5 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* --- Logo --- */}
          <Link
            to={baseUrl === "/" ? "/" : baseUrl}
            className="group flex items-center gap-2 text-2xl font-black tracking-tight text-white"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F47C26] to-purple-600 flex items-center justify-center text-white text-sm shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <FaCode />
            </span>
            <span>
              PORT<span className="text-[#F47C26]">FOLIO</span>.
            </span>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const active = isActiveLink(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative text-sm font-bold uppercase tracking-wide transition-colors ${
                    active ? "text-white" : "text-gray-400 hover:text-[#F47C26]"
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

            {/* CTA Button */}
            <Link
              to={`/contact`}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-[#F47C26] hover:border-[#F47C26] transition-all shadow-lg hover:shadow-orange-500/20"
            >
              Hire Me
            </Link>
          </nav>

          {/* --- Mobile Menu Button --- */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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
            className="md:hidden bg-[#05081a] border-b border-white/10 overflow-hidden"
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
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-white/10">
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
