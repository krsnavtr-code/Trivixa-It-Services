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
  FaGlobe,
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
    <footer className="relative bg-gray-50 dark:bg-[#05081a] border-t border-gray-200 dark:border-white/5 pt-16 pb-10 overflow-hidden transition-colors duration-300">
      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#F47C26] to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Section 1: Top Brand & Social Bar (Full Width) --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-white/10 pb-10 mb-12 gap-6 text-center md:text-left"
        >
          {/* Brand Identity */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
              <FaGlobe className="text-[#F47C26] text-2xl" />
              Trivixa IT Solution<span className="text-[#F47C26]">.</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              Elevating businesses through **trivixa.in**. Your partner for
              Custom Software, MERN Stack Development, and Strategic Digital
              Marketing in India.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-3">
            <SocialIcon
              href="https://wa.me/919084407615"
              icon={<FaWhatsapp />}
              label="Chat on WhatsApp"
              color="hover:bg-green-500 hover:border-green-500"
            />
            <SocialIcon
              href="https://www.linkedin.com/in/trivixa-it-services-75956a3a3/"
              icon={<FaLinkedinIn />}
              label="Follow on LinkedIn"
              color="hover:bg-blue-600 hover:border-blue-600"
            />
            <SocialIcon
              href="https://x.com/TrivixaIt"
              icon={<FaTwitter />}
              label="Follow on X (Twitter)"
              color="hover:bg-sky-500 hover:border-sky-500"
            />
            <SocialIcon
              href="https://www.instagram.com/trivixa_it_solution"
              icon={<FaInstagram />}
              label="Follow on Instagram"
              color="hover:bg-pink-600 hover:border-pink-600"
            />
            <SocialIcon
              href="https://www.facebook.com/profile.php?id=61585637262250"
              icon={<FaFacebookF />}
              label="Like on Facebook"
              color="hover:bg-blue-700 hover:border-blue-700"
            />
          </div>
        </motion.div>

        {/* --- Section 2: Main Links Grid (5 Columns) --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 mb-16"
        >
          {/* Column 1: Web/App Development (SEO Rich) */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
              Web Development
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink
                to="/services/web-development"
                text="Custom Websites"
              />
              <FooterLink to="/services/mern-stack" text="MERN Stack Apps" />
              <FooterLink to="/services/ecommerce" text="E-commerce Stores" />
              <FooterLink to="/services/mobile-apps" text="Mobile App Dev" />
              <FooterLink to="/services/cms" text="WordPress / CMS" />
            </ul>
          </motion.div>

          {/* Column 2: Digital Marketing (SEO Rich) */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
              Digital Marketing
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/services/seo" text="SEO Services" />
              <FooterLink
                to="/services/social-media"
                text="Social Media (SMM)"
              />
              <FooterLink to="/services/ppc" text="Google Ads (PPC)" />
              <FooterLink to="/services/content" text="Content Strategy" />
              <FooterLink to="/services/branding" text="Brand Identity" />
            </ul>
          </motion.div>

          {/* Column 3: Company */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/about" text="About Trivixa" />
              <FooterLink to="/careers" text="Careers & Jobs" />
              <FooterLink to="/team" text="Our Team" />
              <FooterLink to="/testimonials" text="Success Stories" />
              <FooterLink to="/contact" text="Contact Us" />
            </ul>
          </motion.div>

          {/* Column 4: Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
              Resources
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/faqs" text="Help & FAQs" />
              <FooterLink to="/blog" text="Tech Blog" />
              <FooterLink to="/privacy-policy" text="Privacy Policy" />
              <FooterLink to="/terms-of-service" text="Terms of Service" />
              <FooterLink to="/sitemap" text="Sitemap" />
            </ul>
          </motion.div>

          {/* Column 5: Contact Info */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-1"
          >
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-[#F47C26]"></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <FaMapMarkerAlt className="mt-1 text-[#F47C26]" />
                <span className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  Gaur City Mall, Ghaziabad, Uttar Pradesh-201016, India
                </span>
              </li>

              <li className="flex items-center gap-3 group">
                <FaPhoneAlt className="text-[#F47C26]" />
                <a
                  href="tel:+919084407615"
                  className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-[#F47C26] transition-colors"
                >
                  +91 90844 07615
                </a>
              </li>

              <li className="flex items-center gap-3 group">
                <FaEnvelope className="text-[#F47C26]" />
                <a
                  href="mailto:krishna.trivixa@gmail.com"
                  className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-[#F47C26] transition-colors break-all"
                >
                  krishna.trivixa@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* --- Section 3: Bottom Copyright --- */}
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 dark:text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear}{" "}
            <span className="text-gray-900 dark:text-white font-semibold">
              Trivixa IT Solution
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
            <FaCode className="text-[#F47C26]" />
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
              Made in India with ❤️
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Helper Component: Social Icon
const SocialIcon = ({ href, icon, color, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-white hover:-translate-y-1 shadow-sm dark:shadow-none ${color}`}
  >
    {icon}
  </a>
);

// Helper Component: Footer Link
const FooterLink = ({ to, text }) => (
  <li>
    <Link
      to={to}
      className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-[#F47C26] transition-colors duration-300 text-sm"
    >
      <FaChevronRight className="text-[10px] mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#F47C26]" />
      <span className="group-hover:translate-x-1 transition-transform duration-300">
        {text}
      </span>
    </Link>
  </li>
);

export default Footer;
