import { useEffect, useState } from "react";
import {
  getUploadedImages,
  getImageUrl,
  deleteMediaFile,
  checkMediaUsage,
} from "../../api/imageApi";
import { toast } from "react-hot-toast";
import {
  FiCopy,
  FiRefreshCw,
  FiUpload,
  FiTrash2,
  FiSearch,
  FiGrid,
  FiList,
  FiLayers,
  FiLayout, // Icon for Comfortable View
} from "react-icons/fi";
import {
  FaPlay,
  FaImage,
  FaFilm,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ImageGallery = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaInUse, setMediaInUse] = useState({}); // Track which media items are in use

  // View Modes: 'grid' (Square Crop), 'comfortable' (Masonry/Full Ratio), 'compact' (Small), 'list' (Details)
  const [viewMode, setViewMode] = useState("grid");

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  // Check if a media item is in use
  const checkMediaItemUsage = async (filename) => {
    try {
      const usageCheck = await checkMediaUsage(getImageUrl(filename));
      return usageCheck.data.isUsed;
    } catch (error) {
      console.error("Error checking media usage:", error);
      return false;
    }
  };

  // Check all media items for usage
  const checkAllMediaUsage = async (mediaItems) => {
    const usageMap = {};
    for (const item of mediaItems) {
      const filename = item.name || item.filename;
      usageMap[filename] = await checkMediaItemUsage(filename);
    }
    setMediaInUse(usageMap);
  };

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await getUploadedImages();
      if (response && response.data) {
        const mediaWithTypes = response.data.map((item) => ({
          ...item,
          type:
            item.type ||
            (item.mimetype?.startsWith("video/") ? "video" : "image"),
        }));
        setMedia(mediaWithTypes);

        // Check media usage in the background
        checkAllMediaUsage(mediaWithTypes).catch(console.error);
      } else {
        toast.error("Failed to load media: Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied URL to clipboard");
  };

  const getUsageDetails = (usageData) => {
    const details = [];

    if (usageData.projects.count > 0) {
      details.push(`Projects: ${usageData.projects.count}`);
    }
    if (usageData.categories.count > 0) {
      details.push(`Categories: ${usageData.categories.count}`);
    }
    if (usageData.services.count > 0) {
      details.push(`Services: ${usageData.services.count}`);
    }

    return details.length > 0 ? details.join(", ") : "No usage found";
  };

  const handleDelete = async (filename, e) => {
    e.stopPropagation();

    try {
      // First check if the file is in use
      const usageCheck = await checkMediaUsage(getImageUrl(filename));

      if (usageCheck.data.isUsed) {
        // Prepare usage information for both environments
        const usageInfo = [];

        // Check local environment usage
        if (usageCheck.data.usageDetails.environments?.local) {
          const localUsage = usageCheck.data.usageDetails.environments.local;
          const localDetails = getUsageDetails(localUsage);
          if (localDetails !== "No usage found") {
            usageInfo.push(`Local: ${localDetails}`);
          }
        }

        // Check production environment usage
        if (usageCheck.data.usageDetails.environments?.production) {
          const prodUsage =
            usageCheck.data.usageDetails.environments.production;
          const prodDetails = getUsageDetails(prodUsage);
          if (prodDetails !== "No usage found") {
            usageInfo.push(`Production: ${prodDetails}`);
          }
        }

        const usageMessage =
          `This file is currently in use:\n\n${usageInfo.join("\n")}\n\n` +
          "Are you sure you want to delete it? This may break content on your site.";

        if (!window.confirm(usageMessage)) {
          return;
        }
      } else if (!window.confirm("Delete this file permanently?")) {
        return;
      }

      // If we get here, either the file is not in use or user confirmed deletion
      await deleteMediaFile(filename);
      toast.success("File deleted successfully");
      fetchMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
      if (error.message.includes("Cannot delete file")) {
        // Show a more user-friendly error message
        toast.error("Cannot delete file: It's currently in use");
      } else {
        toast.error(error.message || "Failed to delete file");
      }
    }
  };

  // Group media by date
  const groupMediaByDate = (mediaList) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    mediaList.forEach((item) => {
      const date = new Date(item.uploadedAt || item.createdAt || new Date());
      let dateStr;

      // Format date for grouping
      if (date.toDateString() === today.toDateString()) {
        dateStr = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateStr = "Yesterday";
      } else {
        dateStr = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }

      groups[dateStr].push({
        ...item,
        formattedDate: date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    });

    return groups;
  };

  const filteredMedia = media.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    if (!searchTerm) return matchesTab;
    const searchLower = searchTerm.toLowerCase();
    const itemName = (item.filename || item.name || "").toLowerCase();
    return matchesTab && itemName.includes(searchLower);
  });

  const groupedMedia = groupMediaByDate(filteredMedia);

  // Dynamic Container Classes based on View Mode
  const getContainerClasses = () => {
    switch (viewMode) {
      case "comfortable":
        // CSS Columns for Masonry Layout
        return "block columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4";
      case "compact":
        return "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2";
      case "list":
        return "grid grid-cols-1 gap-2";
      default: // grid
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Media <span className="text-[#F47C26]">Gallery</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage and organize digital assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/media-gallery/upload"
              className="inline-flex items-center gap-2 bg-[#F47C26] hover:bg-[#d5671f] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
            >
              <FiUpload /> Upload
            </Link>
            <Link
              to="/admin/media/tags"
              className="inline-flex items-center gap-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/20 px-5 py-2.5 rounded-xl font-medium transition-all hover:-translate-y-1"
            >
              <FiLayers /> Manage Tags
            </Link>
            <button
              onClick={fetchMedia}
              className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              title="Refresh Gallery"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* --- Controls Toolbar --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl w-full xl:w-auto overflow-x-auto">
            {["all", "image", "video"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-white dark:bg-[#0a0f2d] text-[#F47C26] shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>
                  {tab === "all"
                    ? "All Assets"
                    : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab
                      ? "bg-[#F47C26]/10 text-[#F47C26]"
                      : "bg-gray-200/80 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {tab === "all"
                    ? media.length
                    : media.filter((m) => m.type === tab).length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full xl:w-auto">
            {/* View Mode Switcher */}
            <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl shrink-0 overflow-x-auto">
              {[
                { id: "grid", icon: <FiGrid />, title: "Grid (Crop)" },
                {
                  id: "comfortable",
                  icon: <FiLayout />,
                  title: "Comfortable (Masonry)",
                },
                { id: "compact", icon: <FiLayers />, title: "Compact" },
                { id: "list", icon: <FiList />, title: "List" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  title={mode.title}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === mode.id
                      ? "bg-white dark:bg-[#0a0f2d] text-blue-500 shadow-sm"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  {mode.icon}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full xl:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#F47C26] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Visual Context: Asset Pipeline */}
        <div
          className="mb-8 p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help"
          title="View Pipeline"
        >
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
            Asset Delivery Network
          </span>
          [Image of CDN distribution and media optimization flow]
        </div>

        {/* --- Media Grid --- */}
        <div className="space-y-8">
          {Object.entries(groupedMedia).map(([date, items]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {date}
                </h2>
                <span className="text-sm bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={getContainerClasses()}
              >
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item._id || item.name}
                      variants={itemVariants}
                      layout
                      // Note: 'break-inside-avoid' is crucial for Masonry (Comfortable) view
                      className={`group relative bg-gray-100 dark:bg-[#05081a] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-[#F47C26]/50 transition-all cursor-pointer shadow-sm hover:shadow-xl break-inside-avoid ${
                        viewMode === "list"
                          ? "flex items-center gap-4 p-2 h-20 mb-2"
                          : viewMode === "comfortable"
                          ? "mb-4" // Margin bottom for masonry spacing
                          : "aspect-square" // Fixed aspect ratio for grid/compact
                      }`}
                      onClick={() => setSelectedMedia(item)}
                    >
                      {/* Thumbnail */}
                      <div
                        className={`${
                          viewMode === "list"
                            ? "w-16 h-16 rounded-lg shrink-0 overflow-hidden relative"
                            : "w-full h-full"
                        }`}
                      >
                        {item.type === "video" ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <video
                              src={item.url}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className={`${
                                  viewMode === "compact"
                                    ? "w-6 h-6 border-2"
                                    : "w-10 h-10 border"
                                } rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-white/30`}
                              >
                                <FaPlay
                                  className={`text-white ml-0.5 ${
                                    viewMode === "compact"
                                      ? "text-[8px]"
                                      : "text-xs"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.name}
                            // If 'comfortable', use object-contain or cover depending on preference,
                            // but 'h-auto' is implicit in the img tag usually.
                            // We ensure it fills width.
                            className={`w-full transition-transform duration-500 group-hover:scale-110 ${
                              viewMode === "comfortable"
                                ? "h-auto object-contain" // Allow natural height
                                : "h-full object-cover" // Force square
                            }`}
                            loading="lazy"
                          />
                        )}
                      </div>

                      {/* List View Details */}
                      {viewMode === "list" && (
                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                          <div className="col-span-2">
                            <p className="font-bold text-gray-900 dark:text-white truncate">
                              {item.name || "Unnamed"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.url}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {(item.size / 1024).toFixed(1)} KB
                          </div>
                          <div className="text-sm text-gray-500 uppercase">
                            {item.type}
                          </div>
                        </div>
                      )}

                      {/* Overlay Actions (Hidden in Compact, Always visible on Hover for others) */}
                      {viewMode !== "compact" && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-200 flex flex-col justify-end p-3 ${
                            viewMode === "list"
                              ? "opacity-0 group-hover:opacity-100 bg-black/50 flex-row items-center justify-end"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <div
                            className={`flex gap-2 ${
                              viewMode === "list"
                                ? "mr-4"
                                : "justify-center mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.url);
                              }}
                              className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-[#F47C26] text-white transition-colors"
                              title="Copy URL"
                            >
                              <FiCopy size={14} />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDelete(item.name || item.filename, e)
                              }
                              className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-red-500 text-white transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                          {viewMode !== "list" && (
                            <>
                              <p className="text-xs text-white/80 truncate font-medium">
                                {item.name || "Unnamed"}
                              </p>
                              <p className="text-[10px] text-white/50 uppercase tracking-wide">
                                {(item.size / 1024).toFixed(1)} KB • {item.type}
                              </p>
                            </>
                          )}
                        </div>
                      )}

                      {/* Type Badge and In-Use Indicator */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {/* In-Use Indicator */}
                        {mediaInUse[item.name || item.filename] && (
                          <div
                            className="p-1 bg-green-500/90 rounded-full"
                            title="This media is in use"
                          >
                            <FaCheckCircle className="text-white" size={14} />
                          </div>
                        )}

                        {/* Type Badge */}
                        {viewMode !== "list" && (
                          <div className="px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white font-bold uppercase tracking-wider border border-white/10">
                            {item.type === "video" ? "VID" : "IMG"}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </div>

        {!isLoading && filteredMedia.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-4">
              <FaImage size={24} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No media found.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your filters or upload new assets.
            </p>
          </div>
        )}
      </div>

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col bg-[#0a0f2d] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                  <span
                    className={`p-1.5 rounded-lg ${
                      selectedMedia.type === "video"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {selectedMedia.type === "video" ? <FaFilm /> : <FaImage />}
                  </span>
                  <div>
                    <h3 className="text-white text-sm font-bold truncate max-w-md">
                      {selectedMedia.name}
                    </h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {selectedMedia.mimetype}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex-1 overflow-hidden bg-black/50 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                {selectedMedia.type === "video" ? (
                  <video
                    src={selectedMedia.url}
                    className="max-w-full max-h-[65vh] shadow-2xl"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.name}
                    className="max-w-full max-h-[65vh] object-contain shadow-2xl"
                  />
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-black/20 border-t border-white/10 flex justify-end gap-3">
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors"
                >
                  Open Original
                </a>
                <button
                  onClick={() => copyToClipboard(selectedMedia.url)}
                  className="px-4 py-2 rounded-lg bg-[#F47C26] hover:bg-[#d5671f] text-white text-sm font-bold transition-colors shadow-lg"
                >
                  Copy Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
