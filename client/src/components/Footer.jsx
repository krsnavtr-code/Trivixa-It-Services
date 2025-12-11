import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook,
  FaCode,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-black dark:text-white tracking-wider uppercase">
              About Trivixa
            </h3>
            <p className="text-base text-black dark:text-white">
              Trivixa IT Solutions helps individuals and businesses build
              powerful, scalable, and modern digital products — from websites to
              full IT systems.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://wa.me/919084407615"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-orange-400 dark:hover:text-orange-400"
              >
                <FaWhatsapp className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-orange-400 dark:hover:text-orange-400"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-orange-400 dark:hover:text-orange-400"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-orange-400 dark:hover:text-orange-400"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/career"
                  className="text-base text-black hover:text-orange-600 dark:text-white dark:hover:text-orange-400"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-black dark:text-white mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-black dark:text-white text-sm">
                  Trivixa IT Solutions Sector 63, Noida, Uttar Pradesh 201301
                </span>
              </li>

              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-black dark:text-white mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28l1.12 3.37a1 1 0 01-.24 1.04L7 9.47a16 16 0 006.59 6.59l2.06-2.06a1 1 0 011.04-.24l3.37 1.12A2 2 0 0121 17v1a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V6z"
                  />
                </svg>
                <a
                  href="tel:+919990056799"
                  className="text-black dark:text-white hover:text-orange-500"
                >
                  +91 90844 07615
                </a>
              </li>

              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-black dark:text-white mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:krishna.trivixa@gmail.com"
                  className="text-black dark:text-white hover:text-orange-500"
                >
                  krishna.trivixa@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-black dark:text-white">
              &copy; {currentYear} Trivixa IT Solutions. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <FaCode className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-black dark:text-white">
                Crafted with precision & innovation
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
