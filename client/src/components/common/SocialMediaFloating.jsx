import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaShareAlt,
  FaTimes,
} from "react-icons/fa";

const SocialMediaFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- Scroll Detection ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: "https://facebook.com",
      color: "hover:bg-[#1877F2]",
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      url: "https://twitter.com",
      color: "hover:bg-[#1DA1F2]",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      url: "https://instagram.com",
      color:
        "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: "https://linkedin.com",
      color: "hover:bg-[#0A66C2]",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      url: "https://whatsapp.com",
      color: "hover:bg-[#25D366]",
    },
  ];

  // Animation Variants
  const containerVariants = {
    closed: {
      height: "auto",
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
    open: {
      height: "auto",
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20, scale: 0.5, transition: { duration: 0.2 } },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-end pr-2 transition-opacity duration-300 ${
        isScrolled && !isOpen ? "opacity-30 hover:opacity-100" : "opacity-100"
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.div
        className="flex flex-col items-center gap-3 p-2 bg-white/10 dark:bg-[#0a0f2d]/60 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl transition-all duration-300"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
      >
        {/* --- Toggle Button (Always Visible) --- */}
        <motion.div
          className={`w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer text-white shadow-lg transition-all duration-300 ${
            isOpen ? "bg-red-500 rotate-180" : "bg-[#F47C26]"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <FaTimes /> : <FaShareAlt />}
        </motion.div>

        {/* --- Social Icons (Reveal on Hover) --- */}
        <AnimatePresence>
          {isOpen &&
            socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300 ${social.color} hover:text-white relative group`}
              >
                {/* Icon */}
                <span className="text-lg">{social.icon}</span>

                {/* Tooltip Label */}
                <div className="absolute right-full mr-3 px-3 py-1 bg-black/80 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm">
                  {social.name}
                  {/* Arrow for tooltip */}
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
                </div>
              </motion.a>
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SocialMediaFloating;
