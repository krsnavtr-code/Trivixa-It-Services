import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { getFAQs } from "../api/faqApi";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaQuestionCircle,
  FaLightbulb,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await getFAQs();
        if (!Array.isArray(data)) {
          // Fallback static data
          setFaqs([
            {
              id: 1,
              question: "What services does Trivixa specialize in?",
              answer:
                "We specialize in end-to-end digital transformation, including Custom Web Development, Mobile App Development, Cloud Architecture, AI/ML Solutions, and Enterprise Software implementation.",
            },
            {
              id: 2,
              question: "How does your project development process work?",
              answer:
                "We follow an Agile methodology: Discovery & Strategy -> UI/UX Design -> Development (Sprints) -> QA Testing -> Deployment -> Post-Launch Support.",
            },
            {
              id: 3,
              question: "Do you provide post-launch support and maintenance?",
              answer:
                "Yes, we offer flexible support packages including 24/7 monitoring, security updates, and feature enhancements to ensure your software remains robust.",
            },
            {
              id: 4,
              question: "What technologies do you use?",
              answer:
                "Our stack includes React, Next.js, Node.js, Python, AWS, Azure, Docker, Kubernetes, and various modern database technologies.",
            },
            {
              id: 5,
              question: "Can you help migrate our legacy system to the cloud?",
              answer:
                "Absolutely. We have extensive experience in legacy modernization and cloud migration strategies that minimize downtime and data loss.",
            },
          ]);
        } else {
          setFaqs(data);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      <SEO
        title="FAQ | Trivixa IT Solutions"
        description="Find answers to common questions about our IT services, development process, and support."
        keywords="FAQ, IT support, software development process, tech questions"
      />

      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* --- Header --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[#F47C26] dark:bg-white/5 dark:border-white/10 dark:text-[#F47C26] text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-none">
              Support Center
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Questions
              </span>
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to know about working with Trivixa. Find clear
              answers to your technical and business queries.
            </p>

            {/* Search Bar */}
            <div className="mt-10 relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 text-gray-900 dark:bg-white/5 dark:border-white/10 dark:text-white rounded-2xl shadow-lg dark:shadow-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F47C26]/50 focus:border-[#F47C26] transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-white dark:bg-white/5 rounded-2xl animate-pulse border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
                ></div>
              ))}
            </div>
          )}

          {/* FAQ List */}
          {!loading && (
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq._id || faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group bg-white dark:bg-white/5 backdrop-blur-md border ${
                      activeIndex === index
                        ? "border-[#F47C26]/50 shadow-md dark:shadow-[#F47C26]/10"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                    } rounded-2xl overflow-hidden transition-all duration-300 shadow-sm dark:shadow-none`}
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                            activeIndex === index
                              ? "bg-[#F47C26] text-white"
                              : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-[#F47C26]"
                          }`}
                        >
                          <FaLightbulb />
                        </div>
                        <span
                          className={`text-lg font-bold ${
                            activeIndex === index
                              ? "text-[#F47C26]"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>

                      <div
                        className={`p-2 rounded-full transition-transform duration-300 ${
                          activeIndex === index ? "rotate-180" : ""
                        }`}
                      >
                        {activeIndex === index ? (
                          <FaChevronUp className="text-[#F47C26]" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pl-[4.5rem] text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                            <div
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />

                            {/* Diagram Context: Process Flow */}
                            {index === 1 && (
                              <div className="mt-4 p-4 bg-gray-50 dark:bg-black/20 rounded-lg border border-dashed border-gray-300 dark:border-white/10 text-xs text-center text-gray-500 dark:text-gray-400">
                                [Image of agile development lifecycle diagram]
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                  <FaQuestionCircle className="mx-auto text-4xl text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No matching questions found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search terms.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CTA Footer */}
          <div className="mt-20 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find what you're looking for?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:-translate-y-1"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
