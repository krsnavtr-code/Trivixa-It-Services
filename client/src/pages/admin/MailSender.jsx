import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaHandshake,
  FaHistory,
  FaArrowRight,
  FaEnvelopeOpenText,
  FaBuilding,
} from "react-icons/fa";

const MailSender = () => {
  // Card Configuration
  const modules = [
    {
      title: "Brochure Dispatch",
      description:
        "Distribute marketing materials and course brochures to students, colleges, and university partners.",
      icon: <FaEnvelopeOpenText className="text-3xl" />,
      path: "/admin/mail-sender/brochure",
      color: "blue",
      stat: "Marketing Asset",
    },
    {
      title: "Proposal System",
      description:
        "Send formal B2B proposals and partnership agreements to educational institutions.",
      icon: <FaHandshake className="text-3xl" />,
      path: "/admin/mail-sender/proposal",
      color: "purple",
      stat: "B2B Outreach",
    },
    {
      title: "Transmission Logs",
      description:
        "Audit trail of all sent communications. Monitor delivery status, open rates, and bounces.",
      icon: <FaHistory className="text-3xl" />,
      path: "/admin/mail-sender/email-records",
      color: "orange",
      stat: "System Audit",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-12">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Communication <span className="text-[#F47C26]">Dispatch</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            Centralized hub for mass communication. Manage outreach campaigns
            and monitor delivery performance.
          </p>
        </div>

        {/* Visual Context: System Architecture */}
        <div
          className="mb-12 p-6 bg-white/50 dark:bg-black/20 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-70 hover:opacity-100 transition-opacity cursor-help"
          title="View Architecture"
        >
          <span className="text-xs text-gray-400 uppercase tracking-widest mb-3 block">
            Email Infrastructure Status
          </span>
        </div>

        {/* --- Modules Grid --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((module, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Link to={module.path} className="block h-full group">
                <div className="relative h-full bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#F47C26]/30 hover:-translate-y-1">
                  {/* Hover Glow Effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F47C26]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-${module.color}-50 dark:bg-white/10 text-${module.color}-500 dark:text-white mb-4 shadow-inner`}
                    >
                      {module.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-lg">
                      {module.stat}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#F47C26] transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                    {module.description}
                  </p>

                  {/* Action Footer */}
                  <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-4">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                      Initialize Tool
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#F47C26] group-hover:text-white transition-all duration-300">
                      <FaArrowRight className="text-xs" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats / Info Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-100 dark:border-white/5">
            <FaPaperPlane className="text-green-500" />
            <div className="text-xs">
              <p className="font-bold text-gray-900 dark:text-white">
                SMTP Server
              </p>
              <p className="text-gray-500">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-100 dark:border-white/5">
            <FaBuilding className="text-blue-500" />
            <div className="text-xs">
              <p className="font-bold text-gray-900 dark:text-white">
                Daily Quota
              </p>
              <p className="text-gray-500">Unlimited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailSender;
