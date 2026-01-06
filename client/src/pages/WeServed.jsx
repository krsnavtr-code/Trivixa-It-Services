import React from "react";
import { motion } from "framer-motion";
import {
  FaExternalLinkAlt,
  FaGraduationCap,
  FaChartLine,
  FaHeartbeat,
  FaUniversity,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// --- Project Data ---
const projects = [
  {
    id: 1,
    title: "GenLead CRM",
    url: "https://genlead.in",
    category: "SaaS / CRM Product",
    icon: <FaChartLine />,
    description:
      "A comprehensive Customer Relationship Management (CRM) platform designed to streamline sales processes. It features automated lead capturing, follow-up scheduling, and detailed performance analytics.",
    features: [
      "Lead Management",
      "Sales Automation",
      "Team Collaboration",
      "Analytics Dashboard",
    ],
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-500/20",
  },
  {
    id: 2,
    title: "College Vihar",
    url: "https://collegevihar.com",
    category: "EdTech Platform",
    icon: <FaUniversity />,
    description:
      "A dynamic education portal simplifying the college admission process. It allows students to search courses, compare universities, and get expert admission counseling online.",
    features: [
      "University Comparison",
      "Course Finder",
      "Admission Support",
      "Student Lead Gen",
    ],
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-100 dark:border-orange-500/20",
  },
  {
    id: 3,
    title: "FirstVITE",
    url: "https://firstvite.com",
    category: "E-Learning Portal",
    icon: <FaGraduationCap />,
    description:
      "A premier skill development and e-learning platform. FirstVITE bridges the gap between academia and industry by offering job-oriented courses, certifications, and placement support.",
    features: [
      "LMS Integration",
      "Live Classes",
      "Certification System",
      "Job Portal",
    ],
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-100 dark:border-purple-500/20",
  },
  {
    id: 4,
    title: "Ayush Aushadhi",
    url: "https://ayushaushadhi.com",
    category: "HealthTech / E-Commerce",
    icon: <FaHeartbeat />,
    description:
      "A specialized digital platform for Ayurvedic medicines. It connects users with authentic natural remedies, featuring a robust e-commerce system for browsing and purchasing health products.",
    features: [
      "Product Catalog",
      "Secure Payments",
      "Inventory Mgmt",
      "Health Consultations",
    ],
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-100 dark:border-green-500/20",
  },
];

const WeServed = () => {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-500 font-sans">
      {/* --- Ambient Background --- */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-200/20 dark:bg-[#F47C26]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- Section Header --- */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#F47C26] font-bold tracking-widest uppercase text-sm mb-3 block">
              Our Track Record
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              21+ Projects <span className="text-[#F47C26]">Delivered</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We don't just write code; we build businesses. Here are a few of
              the digital transformations we've engineered for our clients.
            </p>
          </motion.div>
        </div>

        {/* --- Projects Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-[#F47C26]/50 dark:hover:border-[#F47C26]/50 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 dark:shadow-none"
            >
              {/* Inner Content */}
              <div className="p-8 md:p-10 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-4 rounded-2xl ${project.bg} ${project.color} text-3xl border ${project.border} transition-transform group-hover:scale-110 duration-300`}
                  >
                    {project.icon}
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-[#F47C26] dark:hover:bg-[#F47C26] hover:text-white dark:hover:text-white rounded-full text-gray-400 dark:text-gray-400 transition-all transform hover:rotate-45 shadow-sm"
                  >
                    <FaExternalLinkAlt size={14} />
                  </a>
                </div>

                {/* Title & Desc */}
                <div className="mb-6 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#F47C26] transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-4 block">
                    {project.category}
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {project.description}
                  </p>
                </div>

                {/* Features Tags */}
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                  <div className="flex flex-wrap gap-3">
                    {project.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-gray-300"
                      >
                        <FaCheckCircle
                          className={`text-[10px] ${project.color}`}
                        />{" "}
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Bottom CTA --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">
            Want to see more?
          </p>
          <Link
            to="/services"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-[#F47C26] border border-transparent rounded-xl hover:bg-[#d5671f] hover:shadow-lg hover:shadow-orange-500/30 gap-2 hover:-translate-y-1"
          >
            View Full Portfolio <FaArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WeServed;
