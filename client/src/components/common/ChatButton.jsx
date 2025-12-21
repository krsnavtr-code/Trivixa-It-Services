import React, { useState, useEffect } from "react";
import { FaCommentDots, FaTimes, FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ContactFormModal from "./ContactFormModal";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrollMode, setIsScrollMode] = useState(false);

  // --- Scroll Detection ---
  useEffect(() => {
    const handleScroll = () => {
      // 250vh = 2.5 * viewport height
      // You can adjust this threshold (e.g., window.innerHeight * 1.5 for appearing sooner)
      const threshold = window.innerHeight * 2.5;

      if (window.scrollY > threshold) {
        setIsScrollMode(true);
      } else {
        setIsScrollMode(false);
      }
    };

    // Add passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Click Handler ---
  const handleClick = () => {
    // Priority 1: If modal is open, close it
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    // Priority 2: If deep in page, Soft Scroll to Top
    if (isScrollMode) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // <--- This enables the soft scrolling effect
      });
    } else {
      // Priority 3: Open Chat
      setIsOpen(true);
    }
  };

  // Determine current icon
  const getIcon = () => {
    if (isOpen) return <FaTimes size={22} />;
    if (isScrollMode) return <FaArrowUp size={22} />;
    return <FaCommentDots size={26} />;
  };

  return (
    <>
      <div className="fixed bottom-8 right-6 z-50 flex items-center justify-end gap-4 pointer-events-none">
        {/* Helper Label with AnimatePresence */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              className="mr-2 bg-white dark:bg-[#0a0f2d]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-gray-800 dark:text-white pointer-events-auto whitespace-nowrap"
            >
              {isOpen
                ? "Close"
                : isScrollMode
                ? "Back to Top"
                : "Need assistance?"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Action Button */}
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`pointer-events-auto relative w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(244,124,38,0.3)] flex items-center justify-center transition-all duration-500 border border-white/10 ${
            isOpen
              ? "bg-gray-900 dark:bg-black text-white" // Close state
              : isScrollMode
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30" // Scroll Top state
              : "bg-[#F47C26] hover:bg-[#d5671f] text-white" // Chat state
          }`}
          aria-label={
            isOpen ? "Close chat" : isScrollMode ? "Scroll to top" : "Open chat"
          }
        >
          {/* Pulse Effect (Only active when Chat mode is available) */}
          {!isOpen && !isScrollMode && (
            <>
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#F47C26] opacity-20 animate-ping duration-1000"></span>
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#F47C26] opacity-10 animate-pulse delay-75"></span>
            </>
          )}

          {/* Icon Switcher */}
          <div
            className={`transition-transform duration-300 relative z-10 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {getIcon()}
          </div>
        </motion.button>
      </div>

      {/* Modal Connection */}
      <ContactFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatButton;
