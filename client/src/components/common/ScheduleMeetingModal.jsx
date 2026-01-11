import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { submitContactForm } from "../../api/contactApi";

const ScheduleMeetingModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle body scroll and scroll to top when modal is open/closed
  useEffect(() => {
    if (isOpen) {
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  // --- Logic: Generate Times ---
  const formatTimeDisplay = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (selectedDate) {
      const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const isWeekend =
        selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

      if (isWeekend) {
        // Weekend times: 10AM, 1PM, 3PM, 6PM, 8PM (stored in 24h format)
        const weekendTimes = ["10:00", "13:00", "15:00", "18:00", "20:00"];
        setAvailableTimes(weekendTimes);
      } else {
        // Weekday times: 9AM, 6PM, 8PM (stored in 24h format)
        const weekdayTimes = ["09:00", "18:00", "20:00"];
        setAvailableTimes(weekdayTimes);
      }

      // Reset selected time when date changes
      setSelectedTime("");
    }
  }, [selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const meetingData = {
        ...formData,
        meetingDate: selectedDate,
        meetingTime: selectedTime,
        meetingType: "Initial Consultation",
        adminEmail: "krishna.trivixa@gmail.com",
      };

      const result = await submitContactForm(meetingData);
      if (result.success) {
        toast.success(
          "Meeting scheduled successfully! Confirmation sent to your email."
        );
        setTimeout(() => {
          onClose();
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
          });
          setSelectedDate(null);
          setSelectedTime("");
          setCurrentStep(1);
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to schedule meeting");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to schedule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 mt-24 flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0a0f2d]/80 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#0F1430] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0a0f2d]">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Schedule a Call / Meeting
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Let's discuss your project and how we can help.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-200 dark:bg-white/5 hover:bg-[#F47C26] hover:text-white dark:hover:bg-[#F47C26] transition-colors text-gray-500 dark:text-gray-400"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 px-4">
              {["Date", "Time", "Details"].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div
                    key={label}
                    className="flex flex-col items-center relative z-10 w-1/3"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-[#F47C26] text-white shadow-lg shadow-orange-500/30"
                          : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isActive ? <FaCheck size={10} /> : stepNum}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isCurrent ? "text-[#F47C26]" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>

                    {/* Line Connector */}
                    {idx < 2 && (
                      <div className="absolute top-4 left-[50%] w-full h-[2px] bg-gray-200 dark:bg-white/5 -z-10">
                        <div
                          className={`h-full bg-[#F47C26] transition-all duration-500`}
                          style={{
                            width: currentStep > stepNum ? "100%" : "0%",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step 1: Select Date */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableDates.map((date) => {
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setCurrentStep(2);
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group overflow-hidden h-full min-h-[110px] ${
                        isSelected
                          ? "bg-gradient-to-br from-[#F47C26] to-[#d5671f] text-white border-transparent shadow-xl shadow-orange-500/30 transform scale-105 z-10"
                          : "bg-white dark:bg-[#0F1430] border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-[#F47C26] hover:bg-gray-50 dark:hover:bg-white/5 hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1"
                      }`}
                    >
                      {/* Hover Glow Effect (Background) */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-[#F47C26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      )}

                      {/* Weekday (e.g., MON) */}
                      <span
                        className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${
                          isSelected
                            ? "text-white/80"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>

                      {/* Date Number (e.g., 12) */}
                      <span
                        className={`text-3xl font-black leading-none my-1 ${
                          isSelected
                            ? "text-white"
                            : "text-gray-900 dark:text-white group-hover:text-[#F47C26] transition-colors"
                        }`}
                      >
                        {date.getDate()}
                      </span>

                      {/* Month (e.g., Jan) */}
                      <span
                        className={`text-xs font-medium ${
                          isSelected
                            ? "text-white/90"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </span>

                      {/* Weekend Badge (Conditional) */}
                      {(date.getDay() === 0 || date.getDay() === 6) && (
                        <span
                          className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            isSelected
                              ? "bg-white/20 text-white border border-white/20"
                              : "bg-orange-50 dark:bg-orange-500/10 text-[#F47C26] border border-orange-100 dark:border-orange-500/20"
                          }`}
                        >
                          Weekend
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Select Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F47C26]/20 text-[#F47C26] rounded-lg">
                      <FaCalendarAlt />
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {selectedDate?.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-[#F47C26] font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setCurrentStep(3);
                      }}
                      className={`py-2.5 px-2 rounded-lg text-sm font-bold border transition-all ${
                        selectedTime === time
                          ? "bg-[#F47C26] text-white border-[#F47C26] shadow-lg shadow-orange-500/30"
                          : "bg-white dark:bg-transparent border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#F47C26] hover:text-[#F47C26]"
                      }`}
                    >
                      {formatTimeDisplay(time)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Details Form */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Summary Card */}
                <div className="flex flex-col sm:flex-row gap-4 bg-gray-100 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 mb-6">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-[#F47C26]/20 text-[#F47C26] rounded-lg">
                      <FaCalendarAlt />
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        Date
                      </p>
                      <p className="text-gray-900 dark:text-white font-bold">
                        {selectedDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-[#F47C26]/20 text-[#F47C26] rounded-lg">
                      <FaClock />
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                        Time
                      </p>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatTimeDisplay(selectedTime)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[#F47C26] text-sm font-bold hover:underline self-center"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <FaPhone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <FaBuilding className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#F47C26] transition-colors" />
                    <input
                      type="text"
                      name="company"
                      placeholder="Company (Optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <textarea
                  name="message"
                  rows="3"
                  placeholder="Any specific topic you want to discuss?"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Confirm Meeting <FaArrowRight />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer (For step 1 & 2) */}
          {currentStep < 3 && (
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0a0f2d] flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="text-gray-500 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-white"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={() => {
                  if (currentStep === 1 && selectedDate) setCurrentStep(2);
                  else if (currentStep === 2 && selectedTime) setCurrentStep(3);
                }}
                disabled={
                  (currentStep === 1 && !selectedDate) ||
                  (currentStep === 2 && !selectedTime)
                }
                className="px-6 py-2 bg-[#F47C26] text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d5671f] transition-all"
              >
                Next Step
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScheduleMeetingModal;
