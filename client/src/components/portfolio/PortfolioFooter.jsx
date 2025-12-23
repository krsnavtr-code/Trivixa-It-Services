import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaLinkedinIn,
  FaDribbble,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCode,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const PortfolioFooter = ({ baseUrl = "/portfolio" }) => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { name: "My Work", href: "/projects" },
        { name: "About Me", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Resume", href: "/resume" },
      ],
    },
    {
      title: "Socials",
      links: [
        { name: "GitHub", href: "https://github.com", external: true },
        { name: "LinkedIn", href: "https://linkedin.com", external: true },
        { name: "Twitter", href: "https://twitter.com", external: true },
        { name: "Dribbble", href: "https://dribbble.com", external: true },
      ],
    },
  ];

  // --- Theme Colors (Emerald Edition) ---
  const brandDark = "#074F3E";
  const brandLight = "#34d399"; // Mint green for text highlights

  const bgClass =
    theme === "dark"
      ? "bg-[#020e0a] border-[#074F3E]/30" // Deep jungle bg
      : "bg-gray-50 border-gray-200";

  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-gray-400" : "text-gray-600";

  // Green Glow in background
  const glowColor = theme === "dark" ? "bg-[#074F3E]/20" : "bg-[#074F3E]/5";

  // Social Buttons
  const socialBg =
    theme === "dark"
      ? `bg-white/5 hover:bg-[#074F3E] hover:text-white`
      : `bg-white border border-gray-200 hover:bg-[#074F3E] hover:text-white hover:border-[#074F3E]`;

  // CTA Button
  const ctaButtonClass =
    theme === "dark"
      ? `bg-[#074F3E]/10 border-[#074F3E] text-[#34d399] hover:bg-[#074F3E] hover:text-white`
      : `bg-white border-gray-200 text-gray-900 hover:bg-[#074F3E] hover:text-white hover:border-[#074F3E]`;

  return (
    <footer
      className={`relative pt-20 pb-10 overflow-hidden border-t transition-colors duration-500 ${bgClass}`}
    >
      {/* Background Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none ${glowColor}`}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Top Section: CTA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${textMain}`}>
              Let’s build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#074F3E] via-[#10b981] to-[#34d399]">
                extraordinary.
              </span>
            </h2>
            <p className={`max-w-md ${textSub}`}>
              Have an idea? Let's turn it into a digital reality. I'm currently
              open for new projects and collaborations.
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <Link
              to="/contact"
              className={`group relative inline-flex items-center gap-3 px-8 py-4 border rounded-2xl font-bold transition-all duration-300 overflow-hidden ${ctaButtonClass}`}
            >
              <span className="relative z-10">Start a Conversation</span>
              <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />

              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-[#074F3E] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
            </Link>
          </div>
        </div>

        {/* Separator Line */}
        <div
          className={`h-px w-full mb-12 ${
            theme === "dark"
              ? "bg-gradient-to-r from-transparent via-[#074F3E]/50 to-transparent"
              : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          }`}
        ></div>

        {/* --- Middle Section: Links --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link to={baseUrl} className="inline-flex items-center gap-2 group">
              <div
                className={`p-2 rounded-lg ${
                  theme === "dark" ? "bg-[#074F3E]" : "bg-[#074F3E] text-white"
                }`}
              >
                <FaCode />
              </div>
              <span
                className={`text-2xl font-black tracking-tight ${textMain}`}
              >
                PORT<span className="text-[#34d399]">FOLIO</span>.
              </span>
            </Link>
            <p className={`text-sm max-w-xs leading-relaxed ${textSub}`}>
              Crafting high-performance digital experiences with a focus on
              design, motion, and precision engineering.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${socialBg}`}
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${socialBg}`}
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${socialBg}`}
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${socialBg}`}
              >
                <FaDribbble />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3
                className={`text-sm font-bold uppercase tracking-wider mb-6 ${textMain}`}
              >
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm transition-colors hover:text-[#34d399] ${textSub}`}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={`text-sm transition-colors hover:text-[#34d399] ${textSub}`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- Bottom Section: Copyright --- */}
        <div
          className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${
            theme === "dark"
              ? "border-[#074F3E]/20 text-gray-500"
              : "border-gray-200 text-gray-500"
          }`}
        >
          <p>&copy; {currentYear} Krishna Avtar. All rights reserved.</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#34d399]" />
              <span>Remote / India</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-[#34d399]" />
              <span>krishna.trivixa@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
