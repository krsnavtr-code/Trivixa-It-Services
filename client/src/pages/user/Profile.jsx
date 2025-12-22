import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/auth/profile");
        const { fullname, email, phone, address, role } = response.data;
        
        setFormData({
          name: fullname || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          role: role || "User",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/profile", {
        phone: formData.phone,
        address: formData.address,
        name: formData.name
      });

      updateUser(response.data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#05081a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05081a] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#F47C26]/10 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- Header --- */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Identity <span className="text-[#F47C26]">Console</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage your personal information and security settings.
            </p>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
            >
              <FaEdit className="text-[#F47C26]" /> Edit Profile
            </button>
          )}
        </div>

        {/* Visual Context: User Data Flow */}
        <div className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help" title="View Data Flow">
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Data Privacy & Security</span>
            
        </div>

        {/* --- Main Card --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none"
        >
          {/* Profile Header / Banner */}
          <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#0a0f2d] dark:to-[#1a1f3d] relative">
             <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-2xl bg-[#F47C26] flex items-center justify-center text-4xl text-white font-bold shadow-lg border-4 border-white dark:border-[#05081a]">
                   {formData.name.charAt(0).toUpperCase()}
                </div>
             </div>
          </div>

          <div className="pt-16 px-8 pb-8">
             <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                <div>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.name}</h2>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1">
                         <FaShieldAlt /> {formData.role}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</span>
                   </div>
                </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                   {/* Name (Read Only usually) */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                      <div className={`flex items-center px-4 py-3 rounded-xl border ${isEditing ? 'bg-white dark:bg-black/20 border-gray-300 dark:border-white/20' : 'bg-gray-50 dark:bg-white/5 border-transparent'}`}>
                         <FaUser className="text-gray-400 mr-3" />
                         <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            disabled={true} 
                            className="bg-transparent w-full focus:outline-none text-gray-500 dark:text-gray-400 cursor-not-allowed"
                         />
                      </div>
                   </div>

                   {/* Email (Read Only) */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                      <div className="flex items-center px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent">
                         <FaEnvelope className="text-gray-400 mr-3" />
                         <input 
                            type="email" 
                            value={formData.email} 
                            disabled={true} 
                            className="bg-transparent w-full focus:outline-none text-gray-500 dark:text-gray-400 cursor-not-allowed"
                         />
                      </div>
                   </div>

                   {/* Phone (Editable) */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact Number</label>
                      <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isEditing ? 'bg-white dark:bg-black/20 border-[#F47C26] ring-1 ring-[#F47C26]' : 'bg-gray-50 dark:bg-white/5 border-transparent'}`}>
                         <FaPhone className={`${isEditing ? 'text-[#F47C26]' : 'text-gray-400'} mr-3`} />
                         <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone} 
                            onChange={handleChange}
                            disabled={!isEditing} 
                            placeholder="Add phone number"
                            className={`bg-transparent w-full focus:outline-none ${isEditing ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                         />
                      </div>
                   </div>

                   {/* Address (Editable) */}
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mailing Address</label>
                      <div className={`flex items-start px-4 py-3 rounded-xl border transition-all ${isEditing ? 'bg-white dark:bg-black/20 border-[#F47C26] ring-1 ring-[#F47C26]' : 'bg-gray-50 dark:bg-white/5 border-transparent'}`}>
                         <FaMapMarkerAlt className={`${isEditing ? 'text-[#F47C26]' : 'text-gray-400'} mr-3 mt-1`} />
                         <textarea 
                            name="address"
                            rows="2"
                            value={formData.address} 
                            onChange={handleChange}
                            disabled={!isEditing} 
                            placeholder="Add your address"
                            className={`bg-transparent w-full focus:outline-none resize-none ${isEditing ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                         />
                      </div>
                   </div>

                </div>

                {/* Actions Footer */}
                <AnimatePresence>
                   {isEditing && (
                      <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10"
                      >
                         <button
                            type="button"
                            onClick={() => {
                               setIsEditing(false);
                               // Ideally reset form here to initial user state
                            }}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2"
                         >
                            <FaTimes /> Cancel
                         </button>
                         <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                         >
                            <FaSave /> Save Changes
                         </button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;