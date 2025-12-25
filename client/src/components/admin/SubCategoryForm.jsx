import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSave,
  FaArrowLeft,
  FaImage,
  FaTimes,
  FaSpinner,
  FaFolderOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  createSubCategory,
  updateSubCategory,
  getSubCategoryById,
} from "../../api/subCategoryApi";
import { getCategories } from "../../api/categoryApi"; // To populate the dropdown

const SubCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form State
  const [formData, setFormData] = useState({
    category: "", 
    name: "",
    description: "",
    isActive: true,
    image: "", 
  });

  // State for Parent Categories Dropdown
  const [parentCategories, setParentCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 1. Load Initial Data (Parent Categories + SubCategory Data if Edit Mode)
  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);

        // Fetch Parent Categories first
        const catResponse = await getCategories({
          limit: 100,
          isActive: true,
          fields: '_id,name',
          sort: 'name'
        });
        console.log('Categories API Response:', catResponse);
        if (catResponse?.success) {
          setParentCategories(catResponse.data || []);
        } else {
          console.error('Failed to load categories:', catResponse?.message || 'Unknown error');
          toast.error('Failed to load parent categories');
        }

        // If Edit Mode, fetch existing SubCategory data
        if (isEditMode) {
          const subResponse = await getSubCategoryById(id);
          if (subResponse?.success) {
            const data = subResponse.data;
            setFormData({
              category: data.category?._id || data.category, // Handle populated or unpopulated ID
              name: data.name,
              description: data.description || "",
              isActive: data.isActive,
              image: data.image || "",
            });
            if (data.image) setImagePreview(data.image);
          }
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a Parent Category");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("SubCategory name is required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData object for file upload
      const data = new FormData();
      data.append("category", formData.category);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);

      if (imageFile) {
        data.append("image", imageFile);
      } else if (formData.image && isEditMode) {
        // Keep existing image if not changed
        data.append("image", formData.image);
      }

      let response;
      if (isEditMode) {
        response = await updateSubCategory(id, data);
      } else {
        response = await createSubCategory(data);
      }

      if (response?.success) {
        toast.success(
          `SubCategory ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate("/admin/subcategories");
      }
    } catch (error) {
      console.error("Error saving subcategory:", error);
      const msg = error.response?.data?.message || "Failed to save subcategory";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/admin/subcategories")}
              className="flex items-center gap-2 text-gray-500 hover:text-[#F47C26] transition-colors mb-2"
            >
              <FaArrowLeft /> Back to List
            </button>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              {isEditMode ? "Edit" : "New"}{" "}
              <span className="text-[#F47C26]">SubCategory</span>
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Parent Category Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Parent Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFolderOpen className="text-gray-400" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] appearance-none transition-all cursor-pointer"
                >
                  <option value="">Select a Parent Category</option>
                  {parentCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                The main category this subcategory belongs to.
              </p>
            </div>

            {/* 2. Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  SubCategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Logo Design"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center h-full pt-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`block w-14 h-8 rounded-full transition-colors ${
                        formData.isActive
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${
                        formData.isActive ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                    {formData.isActive ? "Active" : "Inactive"}
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all"
                placeholder="Describe what this subcategory covers..."
              ></textarea>
            </div>

            {/* 4. Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                SubCategory Image
              </label>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl cursor-pointer hover:border-[#F47C26] hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: "" }));
                      }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => navigate("/admin/subcategories")}
                className="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave />{" "}
                    {isEditMode ? "Update SubCategory" : "Create SubCategory"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubCategoryForm;
