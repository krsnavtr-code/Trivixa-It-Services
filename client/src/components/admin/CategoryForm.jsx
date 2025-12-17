import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaImage,
  FaInfoCircle,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "../../api/categoryApi";

const CategoryForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    master: false,
    isActive: true,
    showOnHome: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id, isEditing]);

  const fetchCategory = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const category = await getCategoryById(id);
      if (!category) throw new Error("Category not found");

      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        imageFile: null,
        master: category.master || false,
        isActive: category.isActive !== false,
        showOnHome: category.showOnHome || false,
      });
    } catch (err) {
      console.error("Error fetching category:", err);
      toast.error(err.message || "Failed to load category");
      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }

    try {
      setLoading(true);
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        isActive: formData.isActive,
        showOnHome: formData.showOnHome,
        master: formData.master,
        image: formData.image?.trim() || "",
      };

      // Handle Image File (if implemented in future expansion)
      let requestData = { ...categoryData };
      if (formData.imageFile instanceof File) {
        const formDataToSend = new FormData();
        Object.entries(categoryData).forEach(([key, value]) => {
          formDataToSend.append(key, String(value));
        });
        formDataToSend.append("image", formData.imageFile);
        requestData = formDataToSend;
      }

      if (isEditing) {
        await updateCategory(id, requestData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(requestData);
        toast.success("Category created successfully");
      }
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error saving category:", err);
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8 max-w-5xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/categories"
                className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 hover:text-[#F47C26] transition-colors"
              >
                <FaArrowLeft />
              </Link>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Category <span className="text-[#F47C26]">Editor</span>
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 ml-12">
              {isEditing
                ? `Editing configuration for "${formData.name}"`
                : "Initialize a new service category"}
            </p>
          </div>
        </div>

        {/* --- Main Form Container --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-none space-y-6"
            >
              {/* Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Category Name <span className="text-[#F47C26]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Web Development"
                  className={`block w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0f2d]/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F47C26]/50 transition-all ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 dark:border-white/10 focus:border-[#F47C26]"
                  }`}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief summary of this category..."
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-2 focus:ring-[#F47C26]/50 transition-all resize-none"
                  disabled={loading}
                />
              </div>

              {/* Image URL Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image URL <span className="text-[#F47C26]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaImage className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#F47C26] focus:ring-2 focus:ring-[#F47C26]/50 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/categories")}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold shadow-lg hover:shadow-orange-500/30 transition-all flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : (
                    <>
                      <FaSave /> Save Configuration
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Right Column: Settings & Preview */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Configuration
              </h3>

              <div className="space-y-4">
                {/* Active Toggle */}
                <div
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-100 dark:border-white/5 cursor-pointer"
                  onClick={() => toggleField("isActive")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        formData.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Active Status
                      </p>
                      <p className="text-xs text-gray-500">Enable in system</p>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      formData.isActive
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.isActive ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Show on Home Toggle */}
                <div
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-100 dark:border-white/5 cursor-pointer"
                  onClick={() => toggleField("showOnHome")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        formData.showOnHome
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <FaGlobe />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Home Visibility
                      </p>
                      <p className="text-xs text-gray-500">
                        Feature on landing
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                      formData.showOnHome
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        formData.showOnHome ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                Asset Preview
              </h3>
              <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-black/40 overflow-hidden border border-gray-200 dark:border-white/10 flex items-center justify-center relative">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <FaImage className="mx-auto mb-2 text-2xl" />
                    <span className="text-xs">No image URL provided</span>
                  </div>
                )}
                {/* Overlay Text Preview */}
                <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-bold truncate">
                    {formData.name || "Category Name"}
                  </p>
                </div>
              </div>
            </div>

            {/* Context Diagram */}
            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2">
                Logic Flow
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
