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
  FiLayout,
  FiCheckSquare,
  FiSquare,
  FiX,
  FiDownload,
  FiExternalLink,
  FiFolder, // Added missing import
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
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaInUse, setMediaInUse] = useState({});

  // View Modes
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

  // --- Logic: Check Media Usage ---
  const checkMediaItemUsage = async (filename) => {
    try {
      const usageCheck = await checkMediaUsage(getImageUrl(filename));
      return usageCheck.data.isUsed;
    } catch (error) {
      // console.error("Error checking media usage:", error);
      return false;
    }
  };

  const checkAllMediaUsage = async (mediaItems) => {
    const usageMap = {};
    // Check in batches or parallel to speed up
    await Promise.all(
      mediaItems.map(async (item) => {
        const filename = item.name || item.filename;
        usageMap[filename] = await checkMediaItemUsage(filename);
      })
    );
    setMediaInUse(usageMap);
  };

  // --- Logic: Fetch Media ---
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
        checkAllMediaUsage(mediaWithTypes);
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

  // --- Logic: Actions ---
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied URL to clipboard");
  };

  const getUsageDetails = (usageData) => {
    const details = [];
    if (usageData?.projects?.count > 0)
      details.push(`Projects: ${usageData.projects.count}`);
    if (usageData?.categories?.count > 0)
      details.push(`Categories: ${usageData.categories.count}`);
    if (usageData?.services?.count > 0)
      details.push(`Services: ${usageData.services.count}`);
    return details.length > 0 ? details.join(", ") : "No usage found";
  };

  const handleDelete = async (filename, e) => {
    if (e) e.stopPropagation();

    try {
      const usageCheck = await checkMediaUsage(getImageUrl(filename));

      if (usageCheck.data.isUsed) {
        const usageInfo = [];
        if (usageCheck.data.usageDetails?.environments?.local) {
          usageInfo.push(
            `Local: ${getUsageDetails(
              usageCheck.data.usageDetails.environments.local
            )}`
          );
        }

        const confirmMsg = `File is in use:\n${usageInfo.join(
          "\n"
        )}\nDelete anyway?`;
        if (!window.confirm(confirmMsg)) return;
      } else if (!window.confirm("Delete permanently?")) {
        return;
      }

      await deleteMediaFile(filename);
      toast.success("Deleted");
      fetchMedia();

      // If deleting from selection mode, update selected items
      if (selectedItems.has(getImageUrl(filename))) {
        const newSet = new Set(selectedItems);
        newSet.delete(getImageUrl(filename));
        setSelectedItems(newSet);
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // --- Logic: Selection ---
  const toggleMediaSelection = (url, event) => {
    if (event) event.stopPropagation();
    setSelectedItems((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(url)) newSelection.delete(url);
      else newSelection.add(url);

      if (newSelection.size === 0) setIsSelectionMode(false);
      else if (!isSelectionMode) setIsSelectionMode(true);

      return newSelection;
    });
  };

  // --- New Logic: Date Group Selection ---
  const toggleDateGroupSelection = (items, event) => {
    if (event) event.stopPropagation();

    // Check if all items in this group are currently selected
    const allSelected = items.every((item) => selectedItems.has(item.url));

    setSelectedItems((prev) => {
      const newSelection = new Set(prev);

      if (allSelected) {
        // Deselect all
        items.forEach((item) => newSelection.delete(item.url));
      } else {
        // Select all
        items.forEach((item) => newSelection.add(item.url));
      }

      if (newSelection.size > 0) setIsSelectionMode(true);
      else setIsSelectionMode(false);

      return newSelection;
    });
  };

  const selectAllMedia = () => {
    const allUrls = media.map((item) => item.url);
    setSelectedItems(new Set(allUrls));
    if (allUrls.length > 0) setIsSelectionMode(true);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  const handleMediaClick = (item, event) => {
    if (isSelectionMode || event.ctrlKey || event.metaKey) {
      toggleMediaSelection(item.url, event);
    } else {
      setSelectedMedia(item);
    }
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.size === 0) return;
    if (!window.confirm(`Delete ${selectedItems.size} items?`)) return;

    try {
      const deletePromises = Array.from(selectedItems).map((url) => {
        const fileName = url.split("/").pop();
        return deleteMediaFile(fileName);
      });
      await Promise.all(deletePromises);

      setMedia((prev) => prev.filter((item) => !selectedItems.has(item.url)));
      clearSelection();
      toast.success("Items deleted");
    } catch (error) {
      toast.error("Error deleting items");
    }
  };

  const copySelectedUrls = () => {
    const urls = Array.from(selectedItems).join("\n");
    copyToClipboard(urls);
  };

  // --- Logic: Filtering & Grouping ---
  const groupMediaByDate = (mediaList) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    mediaList.forEach((item) => {
      const date = new Date(item.uploadedAt || item.createdAt || new Date());
      let dateStr = date.toLocaleDateString();

      if (date.toDateString() === today.toDateString()) dateStr = "Today";
      else if (date.toDateString() === yesterday.toDateString())
        dateStr = "Yesterday";

      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(item);
    });
    return groups;
  };

  const filteredMedia = media.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = (item.name || item.filename || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const groupedMedia = groupMediaByDate(filteredMedia);

  const getContainerClasses = () => {
    switch (viewMode) {
      case "comfortable":
        return "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 block";
      case "compact":
        return "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2";
      case "list":
        return "grid grid-cols-1 gap-2";
      default:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";
    }
  };

  // --- Render ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white p-6 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Ambience (Dark Mode Only) */}
      <div className="fixed inset-0 pointer-events-none hidden dark:block">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F47C26]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Media <span className="text-[#F47C26]">Gallery</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage your digital assets
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSelectionMode ? (
              <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1.5 rounded-xl shadow-sm">
                <span className="text-xs text-gray-600 dark:text-gray-300 px-2 font-medium">
                  {selectedItems.size} selected
                </span>

                <button
                  onClick={selectAllMedia}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Select All"
                >
                  <FiCheckSquare size={16} />
                </button>

                <button
                  onClick={copySelectedUrls}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-blue-500 dark:text-blue-400 transition-colors"
                  title="Copy URLs"
                >
                  <FiCopy size={16} />
                </button>

                <button
                  onClick={deleteSelectedItems}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-red-500 dark:text-red-400 transition-colors"
                  title="Delete Selected"
                >
                  <FiTrash2 size={16} />
                </button>

                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1"></div>

                <button
                  onClick={clearSelection}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Cancel"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSelectionMode(true)}
                className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 font-medium"
              >
                <FiCheckSquare size={16} /> <span>Select</span>
              </button>
            )}

            <Link
              to="/admin/media-gallery/upload"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
            >
              <FiUpload size={18} /> Upload
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 flex flex-col xl:flex-row gap-4 justify-between items-center shadow-sm">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl w-full xl:w-auto overflow-x-auto">
            {["all", "image", "video"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-white dark:bg-[#0a0f2d] text-[#F47C26] shadow-sm dark:shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="capitalize">
                  {tab === "all" ? "All Assets" : tab + "s"}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab
                      ? "bg-[#F47C26]/10 text-[#F47C26]"
                      : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
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
            {/* View Switcher */}
            <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl shrink-0">
              {[
                { id: "grid", icon: <FiGrid />, title: "Grid" },
                { id: "comfortable", icon: <FiLayout />, title: "Masonry" },
                { id: "compact", icon: <FiLayers />, title: "Compact" },
                { id: "list", icon: <FiList />, title: "List" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  title={mode.title}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === mode.id
                      ? "bg-white dark:bg-white/10 text-[#F47C26] shadow-sm"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-white"
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
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-black/20 border border-transparent dark:border-white/10 focus:bg-white dark:focus:bg-black/40 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] focus:ring-1 focus:ring-[#F47C26] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="space-y-8 pb-20">
          {Object.entries(groupedMedia).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/5 pb-2 sticky top-0 bg-gray-50/95 dark:bg-[#0a0f2d]/95 backdrop-blur-sm z-10 py-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-gray-700 dark:text-gray-300 text-sm font-bold uppercase tracking-wider">
                    {date}
                  </h3>
                  <span className="text-gray-500 dark:text-gray-600 text-xs font-normal bg-gray-200 dark:bg-white/5 px-2 py-0.5 rounded-full">
                    {items.length} items
                  </span>
                </div>

                {/* --- Restore Date Group Selection --- */}
                <button
                  onClick={(e) => toggleDateGroupSelection(items, e)}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {items.every((item) => selectedItems.has(item.url)) ? (
                    <>
                      <FiCheckSquare className="text-lg" /> Deselect All
                    </>
                  ) : (
                    <>
                      <FiSquare className="text-lg" /> Select All
                    </>
                  )}
                </button>
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
                      key={item._id || item.filename}
                      variants={itemVariants}
                      layout
                      className={`group relative bg-white dark:bg-[#05081a] border rounded-xl overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-xl break-inside-avoid ${
                        selectedItems.has(item.url)
                          ? "border-blue-500 ring-2 ring-blue-500 dark:border-blue-400 dark:ring-blue-400"
                          : "border-gray-200 dark:border-white/5 hover:border-[#F47C26]/50"
                      } ${
                        viewMode === "list"
                          ? "flex items-center gap-4 p-2 mb-2 h-16"
                          : viewMode === "comfortable"
                          ? "mb-4"
                          : "aspect-square"
                      }`}
                      onClick={(e) => handleMediaClick(item, e)}
                    >
                      {/* Selection Checkbox Overlay */}
                      {(isSelectionMode || selectedItems.has(item.url)) && (
                        <div className="absolute top-2 left-2 z-20">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center transition-colors shadow-sm ${
                              selectedItems.has(item.url)
                                ? "bg-blue-500 text-white"
                                : "bg-white dark:bg-black/50 border border-gray-300 dark:border-white/30 text-transparent hover:border-blue-400"
                            }`}
                          >
                            <FiCheckSquare size={12} />
                          </div>
                        </div>
                      )}

                      {/* Thumbnail */}
                      <div
                        className={`${
                          viewMode === "list"
                            ? "w-12 h-12 rounded-lg shrink-0"
                            : "w-full h-full"
                        } overflow-hidden relative bg-gray-100 dark:bg-black/20`}
                      >
                        {item.type === "video" ? (
                          <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <FaPlay className="text-gray-400 dark:text-white/30 text-2xl group-hover:text-[#F47C26] transition-colors relative z-10" />
                            <video
                              src={item.url}
                              className="absolute inset-0 w-full h-full object-cover opacity-60"
                              muted
                              loop
                              onMouseOver={(e) => e.target.play()}
                              onMouseOut={(e) => {
                                e.target.pause();
                                e.target.currentTime = 0;
                              }}
                            />
                          </div>
                        ) : (
                          <img
                            src={item.url || item.thumbnailUrl}
                            alt={item.name}
                            className={`w-full transition-transform duration-500 group-hover:scale-110 ${
                              viewMode === "comfortable"
                                ? "h-auto"
                                : "h-full object-cover"
                            }`}
                            loading="lazy"
                          />
                        )}

                        {/* Hover Overlay */}
                        {viewMode !== "list" && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-xs text-white font-bold truncate">
                              {item.name || item.filename}
                            </p>
                            <p className="text-[10px] text-gray-300">
                              {(item.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        )}
                      </div>

                      {/* List View Info */}
                      {viewMode === "list" && (
                        <div className="flex-1 min-w-0 flex justify-between items-center pr-4">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-gray-200 truncate">
                              {item.name || item.filename}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.type} • {(item.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.url);
                              }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              title="Copy Link"
                            >
                              <FiCopy />
                            </button>
                            <button
                              onClick={(e) =>
                                handleDelete(item.name || item.filename, e)
                              }
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status Indicators */}
                      <div className="absolute top-2 right-2 flex gap-1 z-10">
                        {mediaInUse[item.name || item.filename] && (
                          <div
                            className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1"
                            title="In Use"
                          >
                            <FaCheckCircle size={10} /> Used
                          </div>
                        )}
                        {viewMode !== "list" && (
                          <div className="px-1.5 py-0.5 bg-white/80 dark:bg-black/60 text-gray-700 dark:text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded">
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

          {!isLoading && filteredMedia.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-4">
                <FaImage size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No media found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Upload new assets or adjust filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-6xl w-full max-h-[90vh] bg-white dark:bg-[#0a0f2d] rounded-2xl overflow-hidden border border-gray-700 dark:border-white/10 flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-gray-200 dark:bg-white/5 rounded-lg text-[#F47C26]">
                    {selectedMedia.type === "video" ? <FaFilm /> : <FaImage />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-gray-900 dark:text-white font-bold truncate text-sm md:text-base">
                      {selectedMedia.name || selectedMedia.filename}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 text-xs uppercase tracking-wider">
                      {selectedMedia.mimetype}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Lightbox Content */}
              <div className="flex-1 bg-gray-100 dark:bg-black/50 flex items-center justify-center p-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                {selectedMedia.type === "video" ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full rounded-lg shadow-lg"
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                )}
              </div>

              {/* Lightbox Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-gray-500 dark:text-gray-500 flex gap-4">
                  <span>Size: {(selectedMedia.size / 1024).toFixed(2)} KB</span>
                  <span>
                    Dimensions:{" "}
                    {selectedMedia.width
                      ? `${selectedMedia.width}x${selectedMedia.height}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <a
                    href={selectedMedia.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FiDownload /> Download
                  </a>
                  <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FiExternalLink /> Open
                  </a>
                  <button
                    onClick={() => copyToClipboard(selectedMedia.url)}
                    className="flex-1 sm:flex-none px-6 py-2 bg-[#F47C26] hover:bg-[#d5671f] text-white text-sm font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiCopy /> Copy Link
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
