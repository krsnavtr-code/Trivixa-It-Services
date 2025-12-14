import React from "react";
import { Link } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaLaptopCode,
  FaHeadset,
  FaChartLine,
  FaCertificate,
  FaRocket,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";

const CorporateTraining = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const trainingPrograms = [
    {
      icon: <FaChalkboardTeacher />,
      title: "Customized Training",
      description:
        "Curriculums tailored specifically to your tech stack and business logic.",
      color: "text-blue-500",
    },
    {
      icon: <FaUsers />,
      title: "Team Synergy",
      description:
        "Collaborative coding workshops and agile methodology bootcamps.",
      color: "text-green-500",
    },
    {
      icon: <FaLaptopCode />,
      title: "Technical Mastery",
      description:
        "Deep dives into React, Cloud Architecture, AI integration, and DevOps.",
      color: "text-purple-500",
    },
    {
      icon: <FaHeadset />,
      title: "Soft Skills for Tech",
      description:
        "Communication protocols for developers and client-facing engineering.",
      color: "text-yellow-500",
    },
    {
      icon: <FaChartLine />,
      title: "Tech Leadership",
      description:
        "Grooming senior developers into CTOs and Engineering Managers.",
      color: "text-red-500",
    },
    {
      icon: <FaCertificate />,
      title: "Certification Prep",
      description:
        "Structured paths for AWS, Azure, and Google Cloud certifications.",
      color: "text-[#F47C26]",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      <SEO
        title="Corporate Training | Trivixa IT Solutions"
        description="Upskill your workforce with Trivixa's enterprise-grade training programs. Specialized courses in Software Development, Cloud, and Leadership."
      />

      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* --- Hero Section --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[#F47C26] dark:bg-white/5 dark:border-white/10 dark:text-[#F47C26] text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-none">
              Enterprise Solutions
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Corporate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Training
              </span>
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Empower your workforce with comprehensive technical programs
              designed to bridge skill gaps and drive business innovation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Request a Demo <FaArrowRight className="text-sm" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300"
              >
                Browse Catalog
              </Link>
            </div>

            {/* Diagram Context: Visualizing the training ecosystem */}
            <div className="mt-16 flex justify-center opacity-90 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl"></div>
          </motion.div>

          {/* --- Programs Grid --- */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Trivixa Training?
              </h2>
              <div className="w-16 h-1 bg-[#F47C26] mx-auto rounded-full"></div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {trainingPrograms.map((program, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-orange-200 dark:hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:shadow-none"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-2xl mb-6 ${program.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#F47C26] transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {program.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* --- Skills Diagram Section --- */}
          <div className="mb-24 grid lg:grid-cols-2 gap-12 items-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl">
            <div>
              <span className="text-[#F47C26] font-bold uppercase tracking-widest text-xs mb-2 block">
                Competency Matrix
              </span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Structured Growth Paths
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We don't just teach syntax; we teach architecture. Our training
                programs map directly to industry-standard competency matrices,
                ensuring your team moves from junior execution to senior
                strategy.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Junior to Mid-Level Transitions",
                  "Cloud Native Adoptions",
                  "Security-First Mindset",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F47C26]"></div>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="opacity-90 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-lg"></div>
          </div>

          {/* --- CTA Section --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0B2545] to-[#05081a] border border-gray-700 dark:border-white/10 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F47C26]/20 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Workforce?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Contact us today to discuss your corporate training needs. We
                build the syllabus that builds your business.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1"
              >
                Get Started <FaRocket />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CorporateTraining;
