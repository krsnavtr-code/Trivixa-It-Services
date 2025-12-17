import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaSave,
  FaGlobe,
  FaTags,
  FaImage,
  FaCog,
  FaEye,
  FaLink,
} from "react-icons/fa";
import {
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
} from "../../api/blogApi";

// --- Custom Quill Styles for Dark Mode ---
// You might want to add this to your global CSS, but it works here as a style block
const quillStyle = `
  .ql-toolbar {
    border-color: rgba(255, 255, 255, 0.1) !important;
    background: rgba(255, 255, 255, 0.05);
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
  }
  .ql-container {
    border-color: rgba(255, 255, 255, 0.1) !important;
    background: rgba(0, 0, 0, 0.2);
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    color: inherit;
    font-size: 1.125rem;
    min-height: 400px;
  }
  .ql-editor.ql-blank::before {
    color: rgba(156, 163, 175, 0.5);
    font-style: italic;
  }
  /* Icon colors in toolbar */
  .dark .ql-stroke { stroke: #9ca3af; }
  .dark .ql-fill { fill: #9ca3af; }
  .dark .ql-picker { color: #9ca3af; }
`;

const BlogPostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("settings"); // 'settings' | 'seo'

  // Standardized Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    tags: "",
    featuredImage: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!isEditMode) return;
      try {
        setLoading(true);
        const response = await getBlogPostById(id);
        const post = response.data?.post || response.post;

        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          status: post.status || "draft",
          tags: post.tags?.join(", ") || "",
          featuredImage: post.featuredImage || "",
          seo: {
            metaTitle: post.seo?.metaTitle || "",
            metaDescription: post.seo?.metaDescription || "",
            metaKeywords: Array.isArray(post.seo?.metaKeywords)
              ? post.seo.metaKeywords.join(", ")
              : post.seo?.metaKeywords || "",
          },
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        navigate("/admin/blog");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode, navigate]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("seo.")) {
      const seoField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        seo: { ...prev.seo, [seoField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required");

    try {
      setSaving(true);
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        seo: {
          ...formData.seo,
          metaKeywords: formData.seo.metaKeywords
            ? formData.seo.metaKeywords
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        },
      };

      // Ensure slug exists
      if (!payload.slug) payload.slug = generateSlug(payload.title);

      if (isEditMode) {
        await updateBlogPost(id, payload);
        toast.success("Article updated successfully");
      } else {
        await createBlogPost(payload);
        toast.success("Article published successfully");
      }
      navigate("/admin/blog");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <style>{quillStyle}</style>
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <form
        onSubmit={handleSubmit}
        className="px-6 py-8 max-w-[1800px] mx-auto"
      >
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 sticky top-4 z-40 bg-gray-100/80 dark:bg-[#0a0f2d]/90 backdrop-blur-lg p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/blog"
              className="p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 hover:text-[#F47C26] transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">
                {isEditMode ? "Edit Article" : "New Article"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEditMode
                  ? "Updating existing content"
                  : "Create a new entry"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/blog")}
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
            >
              {saving ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <FaSave /> {isEditMode ? "Update Post" : "Publish Post"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Content Editor --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
              {/* Title Input */}
              <div className="mb-6">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleTitleBlur}
                  placeholder="Article Title..."
                  className="w-full bg-transparent text-4xl font-black text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 border-none outline-none focus:ring-0 px-0"
                />
              </div>

              {/* Slug Preview */}
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-black/20 p-2 rounded-lg w-fit">
                <FaLink className="text-[#F47C26]" />
                <span>/blog/</span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="bg-transparent border-b border-dashed border-gray-400 focus:border-[#F47C26] outline-none text-gray-700 dark:text-gray-300 min-w-[200px]"
                  placeholder="url-slug-here"
                />
              </div>

              {/* Excerpt */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Short Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] transition-colors resize-none"
                  placeholder="Write a compelling summary..."
                />
              </div>

              {/* Rich Text Editor */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Content Body
                </label>
                <div className="dark:text-gray-200">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Tell your story..."
                    modules={{
                      toolbar: [
                        [{ header: [2, 3, false] }],
                        ["bold", "italic", "underline", "blockquote"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "code-block"],
                        ["clean"],
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Settings Panel --- */}
          <div className="space-y-6">
            {/* Context: SEO Visual */}
            <div
              className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help"
              title="View SEO Strategy"
            >
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2">
                Search Logic
              </span>
            </div>

            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
              {/* Tab Header */}
              <div className="flex border-b border-gray-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                    activeTab === "settings"
                      ? "bg-gray-50 dark:bg-white/10 text-[#F47C26]"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <FaCog /> Settings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                    activeTab === "seo"
                      ? "bg-gray-50 dark:bg-white/10 text-blue-500"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <FaGlobe /> SEO
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "settings" ? (
                    <div className="space-y-6">
                      {/* Status */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Visibility Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26]"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Tags
                        </label>
                        <div className="relative">
                          <FaTags className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="tech, react, guide"
                            className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26]"
                          />
                        </div>
                      </div>

                      {/* Featured Image */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Featured Image
                        </label>
                        <div className="space-y-3">
                          <div className="relative">
                            <FaImage className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              name="featuredImage"
                              value={formData.featuredImage}
                              onChange={handleChange}
                              placeholder="Image URL"
                              className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26]"
                            />
                          </div>
                          {/* Image Preview Box */}
                          <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-black/30 border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
                            {formData.featuredImage ? (
                              <img
                                src={formData.featuredImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            ) : (
                              <div className="text-center text-gray-400">
                                <FaEye className="mx-auto mb-1 text-xl" />
                                <span className="text-xs">No Preview</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* SEO Fields */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Meta Title (Max 60)
                        </label>
                        <input
                          type="text"
                          name="seo.metaTitle"
                          value={formData.seo.metaTitle}
                          onChange={handleChange}
                          maxLength={60}
                          className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex justify-end mt-1">
                          <span className="text-[10px] text-gray-400">
                            {formData.seo.metaTitle.length}/60
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Meta Description (Max 160)
                        </label>
                        <textarea
                          name="seo.metaDescription"
                          value={formData.seo.metaDescription}
                          onChange={handleChange}
                          rows={4}
                          maxLength={160}
                          className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                        <div className="flex justify-end mt-1">
                          <span className="text-[10px] text-gray-400">
                            {formData.seo.metaDescription.length}/160
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Keywords (Comma separated)
                        </label>
                        <textarea
                          name="seo.metaKeywords"
                          value={formData.seo.metaKeywords}
                          onChange={handleChange}
                          rows={3}
                          className="w-full bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
