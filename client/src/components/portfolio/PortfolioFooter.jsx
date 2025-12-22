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
} from "react-icons/fa";

const PortfolioFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Explore",
      links: [
        { name: "My Work", href: "/projects" },
        { name: "About Me", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Resume", href: "/resume" }, // Optional
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

  return (
    <footer className="relative bg-[#05081a] text-gray-300 border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F47C26]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Top Section: CTA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Let’s build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-purple-600">
                extraordinary.
              </span>
            </h2>
            <p className="text-gray-400 max-w-md">
              Have an idea? Let's turn it into a digital reality. I'm currently
              open for new projects and collaborations.
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-[#F47C26] hover:border-[#F47C26] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Start a Conversation</span>
              <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-[#F47C26] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
            </Link>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>

        {/* --- Middle Section: Links --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              {/* Replace with your Portfolio Logo if available, or text */}
              <span className="text-2xl font-black text-white tracking-tight">
                PORT<span className="text-[#F47C26]">FOLIO</span>.
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Crafting high-performance digital experiences with a focus on
              design, motion, and precision engineering.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-[#F47C26] hover:text-white transition-all"
              >
                <FaGithub />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-[#1DA1F2] hover:text-white transition-all"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-[#0A66C2] hover:text-white transition-all"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-lg hover:bg-[#EA4C89] hover:text-white transition-all"
              >
                <FaDribbble />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
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
                        className="text-sm text-gray-500 hover:text-[#F47C26] transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-500 hover:text-[#F47C26] transition-colors"
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
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {currentYear} Trivixa Portfolio. All rights reserved.</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#F47C26]" />
              <span>Remote / Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-[#F47C26]" />
              <span>hello@trivixa.in</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
