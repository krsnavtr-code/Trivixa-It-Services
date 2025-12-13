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
} from "react-icons/fa";
import { toast } from "react-toastify";
import { submitContactForm } from "../api/contactApi";
import { getCourses } from "../api/servicesApi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

  // Fetch Courses Logic (Intact)
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
    <div className="min-h-screen bg-[#0a0f2d] text-white overflow-hidden relative">
      <SEO
        title="Contact Us | Trivixa IT Solutions"
        description="Get in touch with Trivixa for your digital transformation needs. We are here to answer your questions and discuss your next big project."
        keywords="contact Trivixa, IT support, project inquiry, web development agency contact"
      />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none fixed"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F47C26]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F47C26] text-xs font-bold uppercase tracking-wider">
              Get In Touch
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
              Let's Build Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Great
              </span>
            </h1>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
              Have a project in mind or just want to say hi? We'd love to hear
              from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Info Cards */}
              <motion.div
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/[0.08] transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">
                  Contact Details
                </h3>
                <div className="space-y-6">
                  <ContactItem
                    icon={<FaMapMarkerAlt />}
                    title="Headquarters"
                    content="H-161 BSI Sector-63, Noida, UP 201301"
                    color="text-blue-400"
                  />
                  <ContactItem
                    icon={<FaPhoneAlt />}
                    title="Phone"
                    content="+91 99900 56799"
                    subContent="Mon - Fri, 9:00 AM - 6:00 PM"
                    color="text-green-400"
                  />
                  <ContactItem
                    icon={<FaEnvelope />}
                    title="Email"
                    content="info@firstvite.com"
                    subContent="We usually reply within 24 hours"
                    color="text-[#F47C26]"
                  />
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl"
              >
                <h3 className="text-xl font-bold mb-6">Connect With Us</h3>
                <div className="flex gap-4">
                  <SocialLink
                    href="#"
                    icon={<FaFacebookF />}
                    color="hover:bg-blue-600"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaTwitter />}
                    color="hover:bg-sky-500"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaInstagram />}
                    color="hover:bg-pink-600"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaLinkedinIn />}
                    color="hover:bg-blue-700"
                  />
                  <SocialLink
                    href="#"
                    icon={<FaWhatsapp />}
                    color="hover:bg-green-500"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
            >
              {/* Decorative Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[#F47C26] to-purple-500"></div>

              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

              {isSuccess ? (
                <div className="text-center py-20">
                  <div className="mx-auto w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-4xl text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Thank you for reaching out. We'll be in touch shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2 border border-white/20 rounded-lg text-sm hover:bg-white/10 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      Full Name <span className="text-[#F47C26]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0f2d]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F47C26] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Email <span className="text-[#F47C26]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#0a0f2d]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F47C26] transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0a0f2d]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F47C26] transition-colors"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      Interest (Optional)
                    </label>
                    <div className="relative">
                      <select
                        name="courseInterest"
                        value={formData.courseInterest}
                        onChange={handleChange}
                        disabled={isLoadingCourses}
                        className="w-full px-4 py-3 bg-[#0a0f2d]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F47C26] appearance-none"
                      >
                        <option value="" className="bg-[#0a0f2d]">
                          Select a Service / Course
                        </option>
                        {courses.map((course) => (
                          <option
                            key={course.id}
                            value={course.id}
                            className="bg-[#0a0f2d]"
                          >
                            {course.name}
                          </option>
                        ))}
                      </select>
                      {/* Arrow Icon */}
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

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                      Message <span className="text-[#F47C26]">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0f2d]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F47C26] transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
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
                      className="mt-1 w-4 h-4 bg-[#0a0f2d] border border-gray-600 rounded text-[#F47C26] focus:ring-0 focus:ring-offset-0"
                    />
                    <label
                      htmlFor="agreed"
                      className="text-xs text-gray-400 leading-relaxed"
                    >
                      I agree to receive communications from Trivixa. Read our{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-[#F47C26] hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

const ContactItem = ({ icon, title, content, subContent, color }) => (
  <div className="flex items-start gap-4">
    <div
      className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg ${color} border border-white/10 shrink-0`}
    >
      {icon}
    </div>
    <div>
      <h4 className="text-white font-bold">{title}</h4>
      <p className="text-gray-400 text-sm mt-1">{content}</p>
      {subContent && <p className="text-gray-500 text-xs mt-1">{subContent}</p>}
    </div>
  </div>
);

const SocialLink = ({ href, icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white hover:-translate-y-1 hover:border-transparent ${color}`}
  >
    {icon}
  </a>
);
