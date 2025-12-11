import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaFacebookF,
  FaCode,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronRight,
  FaInstagram,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative bg-[#05081a] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-[#F47C26]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16"
        >
          {/* Column 1: About */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Trivixa<span className="text-[#F47C26]">.</span>
              </h2>
              <p className="text-xs text-blue-300 uppercase tracking-widest mt-1">
                IT Solutions
              </p>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              We help individuals and businesses build powerful, scalable, and
              modern digital products — from websites to full IT ecosystems.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <SocialIcon
                href="https://wa.me/919084407615"
                icon={<FaWhatsapp />}
                color="hover:bg-green-500"
              />
              <SocialIcon
                href="#"
                icon={<FaLinkedinIn />}
                color="hover:bg-blue-600"
              />
              <SocialIcon
                href="#"
                icon={<FaTwitter />}
                color="hover:bg-sky-500"
              />
              <SocialIcon
                href="#"
                icon={<FaInstagram />}
                color="hover:bg-pink-600"
              />
            </div>
          </motion.div>

          {/* Column 2: Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/services" text="Our Services" />
              <FooterLink to="/portfolio" text="Portfolio" />
              <FooterLink to="/career" text="Careers" />
              <FooterLink to="/contact" text="Contact" />
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Resources
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/faq" text="FAQs" />
              <FooterLink to="/privacy-policy" text="Privacy Policy" />
              <FooterLink to="/terms-of-service" text="Terms & Conditions" />
              <FooterLink to="/support" text="Support Center" />
              <FooterLink to="/sitemap" text="Sitemap" />
            </ul>
          </motion.div>

          {/* Column 4: Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F47C26] border border-white/10 group-hover:bg-[#F47C26] group-hover:text-white transition-all duration-300 shrink-0">
                  <FaMapMarkerAlt className="text-xs" />
                </div>
                <span className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                  H-161 BSI Sector-63, Noida, <br /> Gautam Budh Nagar, UP
                  201301
                </span>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F47C26] border border-white/10 group-hover:bg-[#F47C26] group-hover:text-white transition-all duration-300 shrink-0">
                  <FaPhoneAlt className="text-xs" />
                </div>
                <a
                  href="tel:+919084407615"
                  className="text-gray-400 text-sm group-hover:text-[#F47C26] transition-colors"
                >
                  +91 90844 07615
                </a>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F47C26] border border-white/10 group-hover:bg-[#F47C26] group-hover:text-white transition-all duration-300 shrink-0">
                  <FaEnvelope className="text-xs" />
                </div>
                <a
                  href="mailto:krishna.trivixa@gmail.com"
                  className="text-gray-400 text-sm group-hover:text-[#F47C26] transition-colors break-all"
                >
                  krishna.trivixa@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear}{" "}
            <span className="text-white font-semibold">
              Trivixa IT Solutions
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <FaCode className="text-[#F47C26]" />
            <span className="text-gray-400 text-xs font-medium">
              Crafted with precision & innovation
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Helper Component: Social Icon
const SocialIcon = ({ href, icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white hover:-translate-y-1 hover:border-transparent ${color}`}
  >
    {icon}
  </a>
);

// Helper Component: Footer Link
const FooterLink = ({ to, text }) => (
  <li>
    <Link
      to={to}
      className="group flex items-center text-gray-400 hover:text-[#F47C26] transition-colors duration-300 text-sm"
    >
      <FaChevronRight className="text-[10px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#F47C26]" />
      <span className="group-hover:translate-x-1 transition-transform duration-300">
        {text}
      </span>
    </Link>
  </li>
);

export default Footer;
