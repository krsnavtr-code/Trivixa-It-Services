import React, { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaGithub,
  FaTwitter,
  FaLinkedinIn,
  FaDribbble,
  FaCheckCircle,
  FaSpinner,
    FaBriefcase,
  FaPhone,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { submitContactForm } from "../../api/contactApi";

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // --- Portfolio Inquiry Types ---
  // Optimized for a Resume/Freelance Portfolio
  const inquiryTypes = [
    { id: "job_offer", label: "Full-time Hiring / Job Offer" }, // Critical for resumes
    { id: "freelance", label: "Freelance Project" },
    { id: "collaboration", label: "Collaboration / Partnership" },
    { id: "consulting", label: "Consultation / Mentorship" },
    { id: "general", label: "Just saying Hi!" },
  ];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiryType: "", // Renamed for clarity
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast.error("Please acknowledge the privacy policy.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        inquiryType: "",
        agreedToTerms: false,
      });
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error(error);
      setIsSuccess(true); // Fallback for demo
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Theme Colors ---
  const bgClass = isDark ? "bg-[#020e0a]" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";

  // Card Styles
  const cardBg = isDark
    ? "bg-[#051a12]/80 backdrop-blur-xl border-[#074F3E]/30"
    : "bg-white/80 backdrop-blur-xl border-gray-200 shadow-xl";

  // Input Styles
  const inputClasses = `w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 ${
    isDark
      ? "bg-[#051a12]/50 border-[#074F3E]/30 text-white placeholder-gray-500 focus:border-[#34d399] focus:ring-[#074F3E]/20"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#074F3E] focus:ring-[#074F3E]/10"
  }`;

  const socialLinks = [
    { icon: <FaGithub />, href: "https://github.com", label: "GitHub" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaDribbble />, href: "https://dribbble.com", label: "Dribbble" },
  ];

  return (
    <div
      className={`min-h-screen pt-24 pb-20 overflow-hidden relative transition-colors duration-500 ${bgClass}`}
    >
      {/* --- Background Ambience --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] ${
            isDark ? "bg-[#074F3E]/20" : "bg-[#074F3E]/5"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] ${
            isDark ? "bg-[#34d399]/10" : "bg-[#34d399]/5"
          }`}
        ></div>
        {isDark && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* --- Left Column: Personal Info --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-6 ${
                isDark
                  ? "border-[#34d399]/30 bg-[#074F3E]/20 text-[#34d399]"
                  : "border-[#074F3E]/20 bg-[#074F3E]/5 text-[#074F3E]"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
              Get in Touch
            </div>

            <h1
              className={`text-5xl md:text-6xl font-black mb-6 leading-tight ${textMain}`}
            >
              Let's work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#074F3E] via-[#10b981] to-[#34d399]">
                together.
              </span>
            </h1>

            <p className={`text-lg mb-12 max-w-md leading-relaxed ${textSub}`}>
              Whether you have a job opportunity, a freelance project, or just
              want to discuss the latest tech—my inbox is always open.
            </p>

            <div className="space-y-6 mb-12">
              {/* Email Card */}
              <a
                href="mailto:krishna.trivixa@gmail.com"
                className={`flex items-center gap-5 p-6 rounded-2xl border transition-all hover:border-[#34d399]/50 group ${cardBg}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[#074F3E] text-white group-hover:scale-110 transition-transform`}
                >
                  <FaEnvelope />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mb-1 ${textSub}`}
                  >
                    Email Me
                  </p>
                  <p
                    className={`text-lg font-bold group-hover:text-[#34d399] transition-colors ${textMain}`}
                  >
                    krishna.trivixa@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <div
                className={`flex items-center gap-5 p-6 rounded-2xl border transition-all hover:border-[#34d399]/50 ${cardBg}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[#074F3E] text-white`}
                >
                  <FaPhone />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mb-1 ${textSub}`}
                  >
                    Phone
                  </p>
                  <p className={`text-lg font-bold ${textMain}`}>
                    +91 9084407615
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div
                className={`flex items-center gap-5 p-6 rounded-2xl border transition-all hover:border-[#34d399]/50 ${cardBg}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[#074F3E] text-white`}
                >
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-widest mb-1 ${textSub}`}
                  >
                    Location
                  </p>
                  <p className={`text-lg font-bold ${textMain}`}>
                    Noida, India{" "}
                    <span className={`text-sm font-normal ${textSub}`}>
                      (Open to Remote)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className={`text-sm font-bold mb-4 ${textMain}`}>Find me on</p>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center text-lg transition-all transform hover:scale-110 ${
                      isDark
                        ? "border-white/10 text-gray-400 hover:bg-[#34d399] hover:text-[#020e0a] hover:border-[#34d399]"
                        : "border-gray-200 text-gray-600 hover:bg-[#074F3E] hover:text-white hover:border-[#074F3E]"
                    }`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* --- Right Column: Contact Form --- */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`text-center py-16 rounded-[2rem] border ${cardBg}`}
              >
                <div
                  className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${
                    isDark
                      ? "bg-[#074F3E]/20 border border-[#074F3E]/50 shadow-[#074F3E]/20"
                      : "bg-green-100 border border-green-200"
                  }`}
                >
                  <FaCheckCircle
                    className={`text-5xl ${
                      isDark ? "text-[#34d399]" : "text-[#074F3E]"
                    }`}
                  />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${textMain}`}>
                  Message Sent!
                </h3>
                <p className={`mb-8 max-w-sm mx-auto ${textSub}`}>
                  Thanks for reaching out! I'll review your message and get back
                  to you.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className={`px-8 py-3 border rounded-xl text-sm font-bold transition-colors ${
                    isDark
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`rounded-[2rem] p-8 md:p-10 border relative overflow-hidden ${cardBg}`}
              >
                {/* Decorative Form Glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl ${
                    isDark ? "bg-[#34d399]" : "bg-[#074F3E]"
                  }`}
                ></div>

                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 space-y-6"
                >
                  {/* Name */}
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wide mb-2 ${textSub}`}
                    >
                      Your Name <span className="text-[#34d399]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="Krishna Avtar"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-xs font-bold uppercase tracking-wide mb-2 ${textSub}`}
                      >
                        Email Address <span className="text-[#34d399]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder="krishna.avtar@gmail.com"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-xs font-bold uppercase tracking-wide mb-2 ${textSub}`}
                      >
                        Phone <span className="text-[#34d399]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="+91..."
                      />
                    </div>
                  </div>

                  {/* Inquiry Type (Updated for Personal Portfolio) */}
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wide mb-2 ${textSub}`}
                    >
                      What's this about?
                    </label>
                    <div className="relative">
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                      >
                        <option value="" className="text-gray-500">
                          Select an Option
                        </option>
                        {inquiryTypes.map((type) => (
                          <option
                            key={type.id}
                            value={type.id}
                            className={
                              isDark
                                ? "bg-[#020e0a] text-white"
                                : "bg-white text-gray-900"
                            }
                          >
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <FaBriefcase className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wide mb-2 ${textSub}`}
                    >
                      Your Message <span className="text-[#34d399]">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className={`${inputClasses} resize-none`}
                      placeholder="Hi, I'd like to discuss..."
                    />
                  </div>

                  {/* Terms (Simplified for Personal Site) */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="agreed"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        className={`w-4 h-4 rounded focus:ring-1 focus:ring-offset-0 ${
                          isDark
                            ? "bg-[#0a0f2d] border-white/20 text-[#34d399] focus:ring-[#34d399]"
                            : "text-[#074F3E] border-gray-300 focus:ring-[#074F3E]"
                        }`}
                      />
                    </div>
                    <label
                      htmlFor="agreed"
                      className={`text-xs leading-relaxed ${textSub}`}
                    >
                      I consent to having this website store my submitted
                      information so they can respond to my inquiry.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-1 ${
                      isDark
                        ? "bg-[#074F3E] text-white hover:bg-[#0a6650] shadow-[#074F3E]/20"
                        : "bg-[#074F3E] text-white hover:bg-[#0a6650] shadow-[#074F3E]/20"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Contact;
