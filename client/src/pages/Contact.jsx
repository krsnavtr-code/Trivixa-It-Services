import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { submitContactForm } from "../api/contactApi";
import { getCourses } from "../api/servicesApi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    courseInterest: "",
    courseInterests: [],
    agreedToTerms: false,
  });

  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch Courses Logic
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses("", false);
        let coursesData = [];
        if (Array.isArray(response)) coursesData = response;
        else if (response && Array.isArray(response.data))
          coursesData = response.data;
        else if (response?.success && Array.isArray(response.data))
          coursesData = response.data;

        if (coursesData.length > 0) {
          const formattedCourses = coursesData.map((course) => ({
            id: course._id || course.id,
            name: course.title || course.name || "Untitled Course",
          }));
          setCourses(formattedCourses);
        } else {
          setCourses([]);
        }
      } catch (error) {
        toast.error("Failed to load course options.");
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast.error("Please accept the terms & conditions.");
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
        courseInterests: [],
        agreedToTerms: false,
      });
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white overflow-hidden relative transition-colors duration-500">
      <SEO
        title="Contact Us | Trivixa IT Solutions"
        description="Get in touch with Trivixa for your digital transformation needs. We are here to answer your questions and discuss your next big project."
        keywords="contact Trivixa, IT support, project inquiry, web development agency contact"
      />

      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* --- Header --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[#F47C26] dark:bg-white/5 dark:border-white/10 dark:text-[#F47C26] text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-none">
              Get In Touch
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Let's Build Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Great
              </span>
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Have a project in mind or just want to say hi? We'd love to hear
              from you. Here is how our engagement process works:
            </p>
            
            {/* Visual Context for User Understanding */}
            <div className="mt-8 flex justify-center opacity-90">
               
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* --- Left Column: Contact Info --- */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Info Cards */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-xl dark:shadow-none hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-6 border-b border-gray-100 dark:border-white/10 pb-4 text-gray-900 dark:text-white">
                  Contact Details
                </h3>
                <div className="space-y-8">
                  <ContactItem
                    icon={<FaMapMarkerAlt />}
                    title="Headquarters"
                    content="Noida, UP 201016"
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-500/10"
                  />
                  <ContactItem
                    icon={<FaPhoneAlt />}
                    title="Phone"
                    content="+91 90844 07615"
                    subContent="Mon - Fri, 9:00 AM - 6:00 PM"
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-50 dark:bg-green-500/10"
                  />
                  <ContactItem
                    icon={<FaEnvelope />}
                    title="Email"
                    content="krishna.trivixa@gmail.com"
                    subContent="We usually reply within 24 hours"
                    color="text-[#F47C26]"
                    bgColor="bg-orange-50 dark:bg-[#F47C26]/10"
                  />
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-lg dark:shadow-none"
              >
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Connect With Us</h3>
                <div className="flex flex-wrap gap-4">
                  <SocialLink
                    href="#"
                    icon={<FaFacebookF />}
                    color="hover:bg-blue-600 hover:border-blue-600"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaTwitter />}
                    color="hover:bg-sky-500 hover:border-sky-500"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaInstagram />}
                    color="hover:bg-pink-600 hover:border-pink-600"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaLinkedinIn />}
                    color="hover:bg-blue-700 hover:border-blue-700"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaWhatsapp />}
                    color="hover:bg-green-500 hover:border-green-500"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* --- Right Column: Form --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl dark:shadow-none relative overflow-hidden"
            >
              {/* Decorative Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-[#F47C26] to-purple-600"></div>

              <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Send a Message</h2>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-16"
                  >
                    <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20">
                      <FaCheckCircle className="text-5xl text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Message Received!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                      Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-8 py-3 border border-gray-300 dark:border-white/20 rounded-xl text-sm font-semibold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Full Name <span className="text-[#F47C26]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-2 focus:ring-[#F47C26]/20 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Email <span className="text-[#F47C26]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-2 focus:ring-[#F47C26]/20 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-2 focus:ring-[#F47C26]/20 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                          placeholder="+91 99999 99999"
                        />
                      </div>
                    </div>

                    {/* Course Selection */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Interest (Optional)
                      </label>
                      <div className="relative">
                        <select
                          name="courseInterest"
                          value={formData.courseInterest}
                          onChange={handleChange}
                          disabled={isLoadingCourses}
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-2 focus:ring-[#F47C26]/20 appearance-none transition-all cursor-pointer"
                        >
                          <option value="" className="text-gray-500">
                            Select a Service / Course
                          </option>
                          {courses.map((course) => (
                            <option
                              key={course.id}
                              value={course.id}
                              className="text-gray-900 bg-white dark:bg-[#0a0f2d] dark:text-white"
                            >
                              {course.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Message <span className="text-[#F47C26]">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-2 focus:ring-[#F47C26]/20 transition-all resize-none placeholder-gray-400 dark:placeholder-gray-600"
                        placeholder="Tell us about your project or inquiry..."
                      />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="agreed"
                          name="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              agreedToTerms: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-[#F47C26] bg-gray-50 dark:bg-[#0a0f2d] border-gray-300 dark:border-white/20 rounded focus:ring-[#F47C26]"
                        />
                      </div>
                      <label
                        htmlFor="agreed"
                        className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
                      >
                        I agree to receive communications from Trivixa. Read our{" "}
                        <Link
                          to="/privacy-policy"
                          className="text-[#F47C26] hover:underline font-semibold"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  </motion.form>
                )}
              </AnimatePresence>
            
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

const ContactItem = ({ icon, title, content, subContent, color, bgColor }) => (
  <div className="flex items-start gap-5">
    <div
      className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center text-xl ${color} border border-transparent dark:border-white/5 shrink-0 transition-transform hover:scale-110`}
    >
      {icon}
    </div>
    <div>
      <h4 className="text-gray-900 dark:text-white font-bold text-lg">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{content}</p>
      {subContent && (
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 font-medium">
          {subContent}
        </p>
      )}
    </div>
  </div>
);

const SocialLink = ({ href, icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-white hover:-translate-y-1 hover:border-transparent ${color} shadow-sm dark:shadow-none`}
  >
    {icon}
  </a>
);