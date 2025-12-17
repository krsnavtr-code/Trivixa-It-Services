import { useEffect, useState } from "react";
import {
  getUploadedImages,
  getImageUrl,
  deleteMediaFile,
} from "../../api/imageApi";
import { toast } from "react-hot-toast";
import {
  FiCopy,
  FiRefreshCw,
  FiUpload,
  FiTrash2,
  FiMaximize2,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { FaPlay, FaImage, FaFilm, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ImageGallery = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
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

  const handleDelete = async (filename, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this file permanently?")) return;

    try {
      await deleteMediaFile(filename);
      toast.success("File deleted");
      fetchMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const filteredMedia = media.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    if (!searchTerm) return matchesTab;
    const searchLower = searchTerm.toLowerCase();
    const itemName = (item.filename || item.name || "").toLowerCase();
    return matchesTab && itemName.includes(searchLower);
  });

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
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl mb-8 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl">
            {["all", "image", "video"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-[#0a0f2d] text-[#F47C26] shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab === "all"
                  ? "All"
                  : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#F47C26] transition-colors"
            />
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
        </div>

        {/* --- Media Grid --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence>
            {filteredMedia.map((item) => (
              <motion.div
                key={item._id || item.name}
                variants={itemVariants}
                layout
                className="group relative aspect-square bg-gray-100 dark:bg-[#05081a] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-[#F47C26]/50 transition-all cursor-pointer shadow-sm hover:shadow-xl"
                onClick={() => setSelectedMedia(item)}
              >
                {/* Thumbnail */}
                {item.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <FaPlay className="text-white text-xs ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                  <div className="flex gap-2 justify-center mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
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
                  <p className="text-xs text-white/80 truncate font-medium">
                    {item.name || "Unnamed"}
                  </p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wide">
                    {(item.size / 1024).toFixed(1)} KB • {item.type}
                  </p>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white font-bold uppercase tracking-wider border border-white/10">
                  {item.type === "video" ? "VID" : "IMG"}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
