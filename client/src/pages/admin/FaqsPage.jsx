import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaGripVertical,
  FaTimes,
  FaSave,
  FaCheckCircle,
  FaQuestion,
} from "react-icons/fa";
import {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  updateFAQOrder,
} from "../../api/faqApi";

// --- Components ---

const FAQModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    status: "active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question || "",
        answer: initialData.answer || "",
        status: initialData.status || "active",
      });
    } else {
      setFormData({ question: "", answer: "", status: "active" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-[#0a0f2d] w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? "Edit Knowledge Item" : "New Knowledge Item"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Question
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26]"
              placeholder="e.g. How do I reset my password?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Answer
            </label>
            <textarea
              rows="4"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#F47C26] resize-none"
              placeholder="Detailed explanation..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex gap-4">
              {["active", "inactive"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFormData({ ...formData, status })}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize border transition-all ${
                    formData.status === status
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-white/10 text-gray-500"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all"
          >
            <FaSave className="inline mr-2" /> Save Item
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const FaqsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Initial Fetch
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllFAQs({ limit: 100, search }); // Admin endpoint
      if (res.success) {
        setFaqs(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load knowledge base");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [search]);

  // Handlers
  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await updateFAQ(editingItem._id, data);
        toast.success("Updated successfully");
      } else {
        await createFAQ(data);
        toast.success("Created successfully");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this item?")) return;
    try {
      await deleteFAQ(id);
      toast.success("Item deleted");
      setFaqs(faqs.filter((f) => f._id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFaqs(items); // Optimistic update

    try {
      const orderedIds = items.map((item) => item._id);
      await updateFAQOrder(orderedIds);
      toast.success("Order updated", { id: "order-toast" });
    } catch (error) {
      toast.error("Failed to save order");
      fetchData(); // Revert on fail
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Knowledge <span className="text-[#F47C26]">Base</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage FAQs and support documentation.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative group">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#0a0f2d]/50 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#F47C26] w-64 transition-all"
              />
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              <FaPlus /> Add Item
            </button>
          </div>
        </div>

        {/* Visual Context */}
        <div
          className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help"
          title="View Logic"
        >
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
            Support Logic Flow
          </span>
        </div>

        {/* --- List Area --- */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-none min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F47C26]"></div>
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FaQuestion className="text-4xl mb-4 opacity-50" />
              <p>No knowledge items found.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="faq-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {faqs.map((faq, index) => (
                      <Draggable
                        key={faq._id || faq.id}
                        draggableId={faq._id || faq.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group bg-gray-50 dark:bg-[#0a0f2d] border ${
                              snapshot.isDragging
                                ? "border-[#F47C26] shadow-2xl scale-105 z-50"
                                : "border-gray-200 dark:border-white/10"
                            } rounded-xl p-4 flex items-start gap-4 transition-all`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="mt-1 text-gray-400 hover:text-[#F47C26] cursor-grab active:cursor-grabbing p-1"
                            >
                              <FaGripVertical />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                  {faq.question}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md ${
                                    faq.status === "active"
                                      ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                      : "bg-gray-200 dark:bg-white/10 text-gray-500"
                                  }`}
                                >
                                  {faq.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {faq.answer}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingItem(faq);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(faq._id)}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Modal */}
      <FAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
};

export default FaqsPage;
