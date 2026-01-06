import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSave,
  FaArrowLeft,
  FaImage,
  FaTimes,
  FaSpinner,
  FaCode,
  FaGlobe,
  FaGithub,
  FaFolderOpen,
  FaChartLine,
  FaSearch,
  FaVideo,
} from "react-icons/fa";
import { motion } from "framer-motion";

// APIs
import {
  createProject,
  updateProject,
  getProjectById,
} from "../../api/projectApi";
import { getCategories } from "../../api/categoryApi";
import { getSubCategories } from "../../api/subCategoryApi";

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // --- State ---
  const [formData, setFormData] = useState({
    // 1. Core
    title: "",
    clientName: "",
    industry: "",
    projectStatus: "Live",
    completionDate: "",

    // 2. Categorization
    category: "",
    subCategories: [], // Array of strings

    // 3. Content
    shortDescription: "",
    fullDescription: "",
    overview: { challenge: "", solution: "", result: "" },

    // 4. Tech & Services (Input strings, converted to arrays on submit)
    techStackInput: "",
    servicesInput: "",

    // 5. Links
    liveUrl: "",
    gitRepoUrlOne: "",
    gitRepoUrlTwo: "",
    videoUrl: "",

    // 6. Metrics
    metrics: {
      durationInWeeks: 0,
      teamSize: 0,
      totalScreens: 0,
      totalUsers: 0,
    },

    // 7. SEO
    seo: { metaTitle: "", metaDescription: "", metaKeywords: "" },

    // 8. Control
    visibility: "Public",
    isFeatured: false,
    cta: { showInquiryButton: true, inquiryLabel: "Start a Similar Project" },
  });

  // Dropdowns
  const [categories, setCategories] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);

  // Image URLs & Previews
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState([""]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Effects ---

  // 1. Load Initial Data
  useEffect(() => {
    const init = async () => {
      try {
        setInitialLoading(true);
        // Fetch Categories
        const catRes = await getCategories({
          limit: 100,
          isActive: true,
          fields: '_id,name',
          sort: 'name'
        });
        console.log('Categories API Response:', catRes);
        if (catRes?.success) {
          setCategories(catRes.data || []);
        } else {
          console.error('Failed to load categories:', catRes?.message || 'Unknown error');
          toast.error('Failed to load categories');
        }

        // Fetch Project if Edit Mode
        if (isEditMode) {
          const response = await getProjectById(id);
          if (response?.success && response.data) {
            const project = response.data;
            console.log('Project data loaded:', project);
            
            // Map Backend Data to Form State
            setFormData({
              title: project.title,
              clientName: project.clientName || "",
              industry: project.industry || "",
              projectStatus: project.projectStatus || "Live",
              completionDate: project.completionDate
                ? project.completionDate.split("T")[0]
                : "",

              category: project.category?._id || project.category,
              subCategories: project.subCategories || [],

              shortDescription: project.shortDescription || "",
              fullDescription: project.fullDescription || "",
              overview: project.overview || {
                challenge: "",
                solution: "",
                result: "",
              },

              // Map array of objects [{name: 'React'}] -> string "React, Node"
              techStackInput:
                project.techStack?.map((t) => t.name).join(", ") || "",
              servicesInput: project.servicesProvided?.join(", ") || "",

              liveUrl: project.liveUrl || "",
              gitRepoUrlOne: project.gitRepoUrlOne || "",
              gitRepoUrlTwo: project.gitRepoUrlTwo || "",
              videoUrl: project.videoUrl || "",

              metrics: project.metrics || {
                durationInWeeks: 0,
                teamSize: 0,
                totalScreens: 0,
                totalUsers: 0,
              },

              seo: {
                metaTitle: project.seo?.metaTitle || "",
                metaDescription: project.seo?.metaDescription || "",
                metaKeywords: project.seo?.metaKeywords?.join(", ") || "",
              },

              visibility: project.visibility || "Public",
              isFeatured: project.isFeatured,
              cta: project.cta || {
                showInquiryButton: true,
                inquiryLabel: "Start a Similar Project",
              },
            });

            // Images
            if (project.thumbnail) {
              setThumbnailUrl(project.thumbnail);
              setFormData(prev => ({ ...prev, thumbnail: project.thumbnail }));
            }
            if (project.heroImage) {
              setHeroImageUrl(project.heroImage);
              setFormData(prev => ({ ...prev, heroImage: project.heroImage }));
            }
            if (project.gallery && project.gallery.length > 0) {
              setGalleryUrls(project.gallery);
              setFormData(prev => ({ ...prev, gallery: project.gallery }));
            }

            // Trigger Subcats
            if (project.category) {
              console.log('Fetching subcategories for category:', project.category);
              await fetchSubCategories(project.category?._id || project.category);
              
              // Ensure subcategories are properly set in form data
              if (project.subCategories && project.subCategories.length > 0) {
                console.log('Setting subcategories:', project.subCategories);
                setFormData(prev => ({
                  ...prev,
                  subCategories: project.subCategories.map(sub => sub._id || sub)
                }));
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [id, isEditMode]);

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      console.log('No category ID provided, clearing subcategories');
      setSubCategoriesList([]);
      return [];
    }
    
    try {
      console.log('Fetching subcategories for category ID:', categoryId);
      const res = await getSubCategories({ 
        categoryId, 
        limit: 100,
        isActive: true,
        fields: '_id,name',
        sort: 'name'
      });
      
      console.log('Subcategories API response:', res);
      
      if (res?.success && res.data) {
        const subCategories = Array.isArray(res.data) ? res.data : [];
        console.log('Setting subcategories list:', subCategories);
        setSubCategoriesList(subCategories);
        return subCategories;
      } else {
        console.error('Failed to load subcategories:', res?.message || 'Unknown error');
        setSubCategoriesList([]);
        return [];
      }
    } catch (err) {
      console.error("Error loading subcategories:", err);
      toast.error('Failed to load subcategories');
      setSubCategoriesList([]);
      return [];
    }
  };

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle Nested Objects (overview.challenge, metrics.teamSize, etc.)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Special logic for Category change
    if (name === "category") {
      fetchSubCategories(value);
      setFormData(prev => ({
        ...prev,
        subCategories: [] // Reset subcategories when category changes
      }));
    }
  };

  // Handle subcategory selection changes
  const handleSubCatChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      // Ensure subCategories is an array
      const currentSubs = Array.isArray(prev.subCategories) ? prev.subCategories : [];
      
      // Convert value to string for consistent comparison
      const subCatId = String(value);
      
      if (checked) {
        // Add subcategory if checked and not already in the array
        if (!currentSubs.some(sub => String(sub) === subCatId)) {
          return {
            ...prev,
            subCategories: [...currentSubs, subCatId]
          };
        }
      } else {
        // Remove subcategory if unchecked
        return {
          ...prev,
          subCategories: currentSubs.filter(id => String(id) !== subCatId)
        };
      }
      
      // If no changes were made (e.g., subcategory already in array)
      return prev;
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    // Note: Advanced logic needed to sync with `galleryFiles` state in edit mode
  };

  const handleImageUrlChange = (url, setUrl, fieldName) => {
    setUrl(url);
    setFormData(prev => ({
      ...prev,
      [fieldName]: url
    }));
  };

  const handleGalleryUrlChange = (index, url) => {
    const newUrls = [...galleryUrls];
    newUrls[index] = url;
    setGalleryUrls(newUrls.filter(url => url.trim() !== ""));
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      gallery: newUrls.filter(url => url.trim() !== "")
    }));
  };

  const addGalleryUrl = () => {
    setGalleryUrls([...galleryUrls, ""]);
  };

  const removeGalleryUrl = (index) => {
    const newUrls = galleryUrls.filter((_, i) => i !== index);
    setGalleryUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      gallery: newUrls.filter(url => url.trim() !== "")
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!formData.title || !formData.category) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      
      // 1. Append required fields first
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("isFeatured", formData.isFeatured || false);
      
      // 2. Append other text fields if they exist
      const optionalTextFields = [
        "clientName",
        "industry",
        "projectStatus",
        "completionDate",
        "shortDescription",
        "fullDescription",
        "liveUrl",
        "gitRepoUrlOne",
        "gitRepoUrlTwo",
        "videoUrl",
      ];
      
      optionalTextFields.forEach((field) => {
        if (formData[field]) {
          data.append(field, formData[field]);
        }
      });

      // 3. Handle subcategories - ensure they're properly formatted as an array of IDs
      const subCategories = Array.isArray(formData.subCategories) 
        ? formData.subCategories
            .map(sub => (typeof sub === 'object' ? sub._id || sub : sub))
            .filter(Boolean)
        : [];
      
      console.log('Submitting subcategories:', subCategories);
      // Send subcategories as a single JSON string
      data.append('subCategories', JSON.stringify(subCategories));

      // 4. Append nested objects as JSON strings
      data.append("overview", JSON.stringify(formData.overview || {}));
      data.append("metrics", JSON.stringify(formData.metrics || {}));
      data.append("cta", JSON.stringify(formData.cta || {}));

      // 5. Handle tech stack
      const techArray = formData.techStackInput
        ? formData.techStackInput
            .split(",")
            .map((t) => ({ name: t.trim() }))
            .filter((t) => t.name)
        : [];
      data.append("techStack", JSON.stringify(techArray));

      // 6. Handle services
      const servicesArray = formData.servicesInput
        ? formData.servicesInput
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [];
      
      console.log('Submitting services:', servicesArray);
      // Send services as a JSON string
      data.append('servicesProvided', JSON.stringify(servicesArray));

      // 7. Handle SEO
      const seoData = {
        metaTitle: formData.seo?.metaTitle || "",
        metaDescription: formData.seo?.metaDescription || "",
        metaKeywords: formData.seo?.metaKeywords 
          ? formData.seo.metaKeywords.split(",").map((k) => k.trim())
          : []
      };
      data.append("seo", JSON.stringify(seoData));

      // 8. Handle images
      if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
      if (formData.heroImage) data.append("heroImage", formData.heroImage);
      
      // Handle gallery - ensure we're using the galleryUrls state which is the source of truth
      const validGalleryUrls = galleryUrls.filter(url => url && url.trim() !== '');
      console.log('Submitting gallery URLs:', validGalleryUrls);
      data.append('gallery', JSON.stringify(validGalleryUrls));

      let response;
      if (isEditMode) {
        response = await updateProject(id, data);
      } else {
        if (!formData.thumbnail) {
          toast.error("Thumbnail URL is required");
          setLoading(false);
          return;
        }
        response = await createProject(data);
      }

      if (response?.success) {
        toast.success(
          `Project ${isEditMode ? "Updated" : "Created"} Successfully!`
        );
        navigate("/admin/projects");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  // --- Styles ---
  const inputClass =
    "w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-all placeholder-gray-400";
  const labelClass =
    "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2";
  const sectionTitleClass =
    "text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-3 mb-6 flex items-center gap-2";

  return (
    <div className="min-h-screen p-6 relative bg-gray-50 dark:bg-[#0a0f2d]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F47C26]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/admin/projects")}
              className="flex items-center gap-2 text-gray-500 hover:text-[#F47C26] mb-2 transition-colors"
            >
              <FaArrowLeft /> Back to Projects
            </button>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              {isEditMode ? "Edit" : "Add"}{" "}
              <span className="text-[#F47C26]">Project</span>
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* === 1. Core Information === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
          >
            <h2 className={sectionTitleClass}>
              <FaFolderOpen className="text-[#F47C26]" /> Core Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. FinTech"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    name="projectStatus"
                    value={formData.projectStatus}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Live">Live</option>
                    <option value="In Development">In Development</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Completion Date</label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Categorization */}
              <div>
                <label className={labelClass}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>SubCategory</label>
                {subCategoriesList.map((subCat) => {
                  const subCatId = String(subCat._id || subCat);
                  const currentSubs = Array.isArray(formData.subCategories) ? formData.subCategories : [];
                  const isChecked = currentSubs.some(id => String(id) === subCatId);
                  
                  return (
                    <div key={subCatId} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`subcat-${subCatId}`}
                        value={subCatId}
                        checked={isChecked}
                        onChange={handleSubCatChange}
                        className="h-4 w-4 text-[#F47C26] rounded border-gray-300 focus:ring-[#F47C26]"
                      />
                      <label
                        htmlFor={`subcat-${subCatId}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {subCat.name || subCat}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* === 2. Case Study & Content === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
          >
            <h2 className={sectionTitleClass}>
              <FaCode className="text-[#F47C26]" /> Case Study
            </h2>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>
                  Short Description (200 chars)
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows="2"
                  className={inputClass}
                  maxLength="200"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>The Challenge</label>
                  <textarea
                    name="overview.challenge"
                    value={formData.overview.challenge}
                    onChange={handleChange}
                    rows="5"
                    className={inputClass}
                    placeholder="What problem needed solving?"
                  />
                </div>
                <div>
                  <label className={labelClass}>The Solution</label>
                  <textarea
                    name="overview.solution"
                    value={formData.overview.solution}
                    onChange={handleChange}
                    rows="5"
                    className={inputClass}
                    placeholder="How did we build it?"
                  />
                </div>
                <div>
                  <label className={labelClass}>The Result</label>
                  <textarea
                    name="overview.result"
                    value={formData.overview.result}
                    onChange={handleChange}
                    rows="5"
                    className={inputClass}
                    placeholder="Outcome / Impact"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Full Detailed Description (HTML/Markdown support planned)
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  rows="6"
                  className={inputClass}
                />
              </div>
            </div>
          </motion.div>

          {/* === 3. Tech & Metrics === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
          >
            <h2 className={sectionTitleClass}>
              <FaChartLine className="text-[#F47C26]" /> Tech & Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  name="techStackInput"
                  value={formData.techStackInput}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="React, Node.js, MongoDB..."
                />
              </div>
              <div>
                <label className={labelClass}>
                  Services Provided (Comma Separated)
                </label>
                <input
                  type="text"
                  name="servicesInput"
                  value={formData.servicesInput}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="UI/UX Design, Backend API..."
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <label className={labelClass}>Duration (Weeks)</label>
                <input
                  type="number"
                  name="metrics.durationInWeeks"
                  value={formData.metrics.durationInWeeks}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Team Size</label>
                <input
                  type="number"
                  name="metrics.teamSize"
                  value={formData.metrics.teamSize}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Total Screens</label>
                <input
                  type="number"
                  name="metrics.totalScreens"
                  value={formData.metrics.totalScreens}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Total Users</label>
                <input
                  type="number"
                  name="metrics.totalUsers"
                  value={formData.metrics.totalUsers}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </motion.div>

          {/* === 4. Media === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
          >
            <h2 className={sectionTitleClass}>
              <FaImage className="text-[#F47C26]" /> Media Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Thumbnail URL */}
              <div>
                <label className={labelClass}>Thumbnail Image URL (Grid)</label>
                <div className="relative w-full">
                  <input
                    type="url"
                    placeholder="https://example.com/thumbnail.jpg"
                    value={thumbnailUrl}
                    onChange={(e) => 
                      handleImageUrlChange(e.target.value, setThumbnailUrl, 'thumbnail')
                    }
                    className={`${inputClass} w-full`}
                  />
                  {thumbnailUrl && (
                    <div className="mt-2 w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20fill%3D%22%23999%22%3EImage%20not%20found%3C%2Ftext%3E%3C%2Fsvg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Image URL */}
              <div>
                <label className={labelClass}>Hero Image URL (Detail Page)</label>
                <div className="relative w-full">
                  <input
                    type="url"
                    placeholder="https://example.com/hero.jpg"
                    value={heroImageUrl}
                    onChange={(e) => 
                      handleImageUrlChange(e.target.value, setHeroImageUrl, 'heroImage')
                    }
                    className={`${inputClass} w-full`}
                  />
                  {heroImageUrl && (
                    <div className="mt-2 w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                      <img
                        src={heroImageUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20fill%3D%22%23999%22%3EImage%20not%20found%3C%2Ftext%3E%3C%2Fsvg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label className={labelClass}>Gallery Image URLs</label>
                <button
                  type="button"
                  onClick={addGalleryUrl}
                  className="text-sm text-[#F47C26] hover:text-[#e06e1a] flex items-center"
                >
                  <span className="mr-1">+</span> Add Image URL
                </button>
              </div>
              <div className="space-y-4">
                {galleryUrls.map((url, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <input
                        type="url"
                        placeholder={`Gallery image URL #${idx + 1}`}
                        value={url}
                        onChange={(e) => handleGalleryUrlChange(idx, e.target.value)}
                        className={`${inputClass} w-full`}
                      />
                      {url && (
                        <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20fill%3D%22%23999%22%3EImage%3C%2Ftext%3E%3C%2Fsvg%3E';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {galleryUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGalleryUrl(idx)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove image"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addGalleryUrl}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#F47C26] hover:border-[#F47C26] transition-colors"
              >
                <span className="mr-2">+</span> Add Image URL
              </button>
            </div>
          </motion.div>

          {/* === 5. Links, SEO & Visibility === */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm"
          >
            <h2 className={sectionTitleClass}>
              <FaSearch className="text-[#F47C26]" /> Links & SEO
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>
                  <FaGlobe className="inline mr-2" /> Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <FaVideo className="inline mr-2" /> Video Demo URL
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <FaGithub className="inline mr-2" /> Git Repo 1
                </label>
                <input
                  type="url"
                  name="gitRepoUrlOne"
                  value={formData.gitRepoUrlOne}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <FaGithub className="inline mr-2" /> Git Repo 2
                </label>
                <input
                  type="url"
                  name="gitRepoUrlTwo"
                  value={formData.gitRepoUrlTwo}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input
                  type="text"
                  name="seo.metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength="60"
                />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  name="seo.metaDescription"
                  value={formData.seo.metaDescription}
                  onChange={handleChange}
                  rows="2"
                  className={inputClass}
                  maxLength="160"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Meta Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  name="seo.metaKeywords"
                  value={formData.seo.metaKeywords}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-8 pt-6 border-t border-gray-200 dark:border-white/10 mt-6">
              <label className="flex items-center cursor-pointer gap-2">
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className={`${inputClass} w-auto py-2`}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#F47C26]"
                />
                <span className="text-gray-700 dark:text-white font-medium">
                  Featured Project
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="cta.showInquiryButton"
                  checked={formData.cta.showInquiryButton}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#F47C26]"
                />
                <span className="text-gray-700 dark:text-white font-medium">
                  Show Inquiry Button
                </span>
              </label>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/projects")}
              className="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {isEditMode ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;