import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Assuming you use hot-toast based on previous navbar, if react-toastify, swap imports
import { submitContactForm } from "../../api/contactApi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ContactFormModal = (props) => {
  // Destructure props to get isOpen and onClose
  const { isOpen, onClose } = props;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    courseInterest: "",
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Load projects
  useEffect(() => {
    if (isOpen) {
      const loadProjects = async () => {
        try {
          const response = await fetch("/api/projects");
          if (response.ok) {
            const data = await response.json();
            setProjects(Array.isArray(data) ? data : data.data || []);
          }
        } catch (error) {
          console.error("Error loading projects:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      };
      loadProjects();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent rapid submissions (5 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      toast.error("Please wait a few seconds before submitting again");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("Please accept the terms & conditions and privacy policy");
      return;
    }

    setLastSubmitTime(now);
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        projectId: formData.projectInterest,
        projectTitle: formData.projectInterest
          ? projects.find((p) => p._id === formData.projectInterest)?.title ||
            ""
          : "",
      };

      delete submissionData.projectInterest;

      const result = await submitContactForm(submissionData);

      if (result.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          projectInterest: "",
          agreedToTerms: false,
        });

        // Delay closing to show success state briefly
        setTimeout(() => {
          onClose();
          navigate("/thank-you", {
            state: {
              message:
                result.message || "Your message has been sent successfully!",
              conversionData: {
                transaction_id: "",
                value: 1.0,
                currency: "INR",
              },
            },
          });
          setIsSuccess(false); // Reset for next time
        }, 1500);
      } else {
        if (result.errors) {
          Object.values(result.errors).forEach((error) => {
            toast.error(error);
          });
        } else {
          toast.error(
            result.message || "Failed to send message. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.message ||
          error.response?.data?.message ||
          "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Create a filtered props object to exclude the jsx prop
  const filteredProps = { isOpen, onClose };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0f2d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-white/5">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Request a Callback
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Leave your details, we'll connect shortly.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <FaCheck className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    We have received your request and will get back to you
                    shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-gray-300 uppercase tracking-wide"
                    >
                      Full Name <span className="text-[#F47C26]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-gray-300 uppercase tracking-wide"
                    >
                      Email Address <span className="text-[#F47C26]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all text-sm"
                      placeholder="name@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-medium text-gray-300 uppercase tracking-wide"
                    >
                      Phone Number <span className="text-[#F47C26]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all text-sm"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Project Select */}
                  <div className="space-y-1">
                    <label
                      htmlFor="projectInterest"
                      className="block text-xs font-medium text-gray-300 uppercase tracking-wide"
                    >
                      I need like this (Optional)
                    </label>
                    <div className="relative">
                      <select
                        id="projectInterest"
                        name="projectInterest"
                        value={formData.projectInterest}
                        onChange={handleChange}
                        disabled={isLoadingProjects}
                        className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all text-sm appearance-none"
                      >
                        <option value="" className="bg-[#0a0f2d] text-gray-400">
                          Select a project
                        </option>
                        {isLoadingProjects ? (
                          <option disabled className="bg-[#0a0f2d]">
                            Loading projects...
                          </option>
                        ) : (
                          projects.map((project) => (
                            <option
                              key={project._id || project.id}
                              value={project._id || project.id}
                              className="bg-[#0a0f2d] text-white"
                            >
                              {project.title || project.name}
                            </option>
                          ))
                        )}
                      </select>
                      {/* Custom Arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg
                          className="h-4 w-4"
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

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <div className="flex items-center h-5">
                      <input
                        id="agreedToTerms"
                        name="agreedToTerms"
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        required
                        className="w-4 h-4 rounded border-gray-600 bg-white/10 text-[#F47C26] focus:ring-[#F47C26] focus:ring-offset-0 focus:ring-offset-[#0a0f2d]"
                      />
                    </div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      <label htmlFor="agreedToTerms">
                        I agree to receive promotional emails & messages via
                        WhatsApp/SMS. Read our{" "}
                        <Link
                          to="/terms-of-service"
                          className="text-[#F47C26] hover:underline"
                        >
                          Terms
                        </Link>{" "}
                        &{" "}
                        <Link
                          to="/privacy-policy"
                          className="text-[#F47C26] hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-[#F47C26] to-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Request <FaPaperPlane className="ml-2 text-xs" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;
