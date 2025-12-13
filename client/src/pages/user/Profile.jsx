import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { useLMS } from "../../contexts/LMSContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaBookOpen,
  FaArrowRight,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const Profile = () => {
  const { currentUser: authUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const {
    enrollments,
    loading: lmsLoading,
    loadEnrollments,
    error: lmsError,
  } = useLMS();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize Data
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullname: authUser.fullname || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
      });
    }
  }, [authUser]);

  // Load Courses
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        await loadEnrollments();
      } catch (err) {
        console.error("Error loading enrollments:", err);
      }
    };
    fetchEnrollments();
  }, [loadEnrollments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!authUser) throw new Error("User not authenticated");

      const { phone, address } = formData;

      if (!phone && !address) {
        throw new Error("Please provide at least one field to update");
      }

      const response = await userApi.updateProfile({ phone, address });

      if (response && response.success) {
        updateUser({
          ...authUser,
          ...(phone && { phone }),
          ...(address && { address }),
        });

        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        throw new Error(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("Users");
        navigate("/login", { state: { from: "/profile" } });
      }
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/lms/services/${courseId}`);
  };

  if (!authUser) {
    navigate("/login", { state: { from: "/profile" } });
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0a0f2d] relative overflow-hidden transition-colors duration-300 pb-20 mt-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        {/* --- Header --- */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            My Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your personal information and track your learning progress.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Profile Card --- */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl dark:shadow-none sticky top-24"
            >
              {/* Decorative Top Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 rounded-t-2xl"></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaUser className="text-[#F47C26]" /> Profile Details
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    title="Edit Profile"
                  >
                    <FaEdit />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name (Read Only usually, but editable here based on logic) */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      disabled // Usually name isn't editable directly to prevent fraud, change if needed
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-gray-900 dark:text-white transition-all ${
                        isEditing
                          ? "bg-white dark:bg-[#0a0f2d] border-blue-500 ring-2 ring-blue-500/20"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                      }`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-gray-900 dark:text-white transition-all ${
                        isEditing
                          ? "bg-white dark:bg-[#0a0f2d] border-blue-500 ring-2 ring-blue-500/20"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                      }`}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-70"
                      >
                        {isSaving ? (
                          <>
                            <FaSpinner className="animate-spin" /> Saving...
                          </>
                        ) : (
                          <>
                            <FaSave /> Save Changes
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>

          {/* --- Right Column: My Learning --- */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaBookOpen className="text-blue-500" /> My Learning
            </h2>

            {lmsLoading ? (
              // Loading Skeletons
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse overflow-hidden"
                  >
                    <div className="h-32 bg-gray-200 dark:bg-white/10" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : enrollments && enrollments.length > 0 ? (
              // Course Grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((enrollment, index) => {
                  const course = enrollment.course;
                  const isCompleted =
                    enrollment.completionStatus === "completed";

                  return (
                    <motion.div
                      key={enrollment._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex flex-col h-full bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none dark:hover:bg-white/[0.08] dark:hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                      onClick={() => handleCourseClick(course._id)}
                    >
                      {/* Image Area */}
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-[#0a0f2d]">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/300x200?text=Course";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <FaBookOpen className="text-4xl mb-2 opacity-50" />
                            <span className="text-sm">No Preview</span>
                          </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                        {/* Status Badge */}
                        {isCompleted && (
                          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <FaCheckCircle /> Completed
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course?.title || "Untitled Course"}
                        </h3>

                        <div className="mt-auto pt-4">
                          <button
                            className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                              isCompleted
                                ? "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                                : "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                Review Course{" "}
                                <FaArrowRight className="text-xs" />
                              </>
                            ) : (
                              <>
                                Continue Learning{" "}
                                <FaArrowRight className="text-xs" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Empty State
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <FaBookOpen className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  No Enrollments Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">
                  You haven't enrolled in any courses yet. Explore our catalog
                  to get started!
                </p>
                <button
                  onClick={() => navigate("/services")}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
