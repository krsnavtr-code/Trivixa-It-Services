import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  FaSearch,
  FaChevronDown,
  FaQuestionCircle,
  FaLightbulb,
  FaHeadset,
} from "react-icons/fa";
import { getPublicFAQs } from "../api/faqApi";

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPublicFAQs();
        const data = response.data || response;
        setFaqs(data);
        setFilteredFaqs(data);
      } catch (error) {
        console.error("Error loading FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredFaqs(faqs);
    } else {
      const query = search.toLowerCase();
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
      setFilteredFaqs(filtered);
    }
  }, [search, faqs]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // --- Generate Dynamic FAQ Schema for Google ---
  // This helps your questions appear directly in Google Search Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<[^>]+>/g, ""), // Strip HTML tags for Schema safety
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05081a] relative overflow-hidden transition-colors duration-300">
      <SEO
        title="FAQ - Frequently Asked Questions | Trivixa IT Solution"
        description="Find answers to common questions about Trivixa's web development services, SEO pricing, support, and project timelines."
        keywords="Trivixa FAQ, IT Support Questions, Web Development Process, SEO Services Cost"
      />

      {/* Inject JSON-LD Schema */}
      {!loading && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* --- Ambient Background --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FaLightbulb /> Support Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
          >
            Frequently Asked <span className="text-[#F47C26]">Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to know about <strong>Trivixa.in</strong>{" "}
            services, billing, and technical support.
          </motion.p>
        </div>

        {/* --- Search Bar --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-2xl mx-auto mb-16 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white dark:bg-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-2xl p-2 flex items-center shadow-xl">
            <FaSearch className="ml-4 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search topics (e.g., 'SEO', 'Pricing')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none px-4 py-3 text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </div>
        </motion.div>

        {/* --- FAQ List --- */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-12 opacity-60">
            <FaQuestionCircle className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No matching questions found for "{search}".
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-[#F47C26] hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq._id || index}
                variants={itemVariants}
                className="group"
              >
                <div
                  onClick={() => toggleAccordion(index)}
                  className={`cursor-pointer bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? "shadow-lg ring-1 ring-[#F47C26]/50"
                      : "hover:border-[#F47C26]/30 hover:shadow-md"
                  }`}
                >
                  {/* Question Header */}
                  <div className="p-6 flex items-center justify-between gap-4">
                    <h3
                      className={`text-lg font-bold transition-colors ${
                        openIndex === index
                          ? "text-[#F47C26]"
                          : "text-gray-900 dark:text-white group-hover:text-[#F47C26]"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`p-2 rounded-full bg-gray-100 dark:bg-white/10 transition-transform duration-300 ${
                        openIndex === index
                          ? "rotate-180 bg-[#F47C26]/10 text-[#F47C26]"
                          : "text-gray-500"
                      }`}
                    >
                      <FaChevronDown />
                    </div>
                  </div>

                  {/* Answer Content */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5 mt-2 pt-4">
                          <div
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                            className="prose dark:prose-invert max-w-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Visual Context: Support Workflow */}
        <div className="mt-20 p-8 bg-white/50 dark:bg-black/20 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl mb-4">
              <FaHeadset />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              If you couldn't find the answer above, here is how our support
              process works to get you resolved quickly.
            </p>

            {/* Diagram Placeholder */}
            <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity"></div>

            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/30"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
