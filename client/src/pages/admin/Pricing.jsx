import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast based on previous context, change back to react-toastify if needed
import { getPricing, updatePricing, deletePricing } from "../../api/pricingApi";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaLayerGroup,
  FaTags,
} from "react-icons/fa";

const PricingAdmin = () => {
  const [pricingData, setPricingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      const data = await getPricing();
      setPricingData(data);
    } catch (error) {
      toast.error("Failed to fetch pricing data");
      console.error("Error fetching pricing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCategory = async (data) => {
    try {
      const categoryKey =
        editingCategory || data.title.toLowerCase().replace(/\s+/g, "-");

      const categoryData = {
        categoryKey,
        title: data.title,
        subtitle: data.subtitle || "",
        icon: data.icon || "default-icon",
        plans: (editingCategory && pricingData[editingCategory]?.plans) || [],
      };

      await updatePricing(categoryData);
      toast.success(
        editingCategory
          ? "Category updated successfully"
          : "Category added successfully"
      );

      reset();
      setShowCategoryForm(false);
      setEditingCategory(null);
      fetchPricingData();
    } catch (error) {
      toast.error("Failed to save category");
      console.error("Error saving category:", error);
    }
  };

  const onSubmitPlan = async (data) => {
    try {
      // Helper function to extract numeric value from price string
      const getPriceAmount = (priceStr) => {
        if (!priceStr) return 0;
        const numericValue = priceStr.replace(/[^0-9.]/g, "");
        return parseFloat(numericValue) || 0;
      };

      const planData = {
        id: editingPlan?.id || Date.now().toString(),
        name: data.planName,
        tagline: data.tagline,
        // Price range fields
        priceFrom: data.priceFrom || "",
        priceFromAmount: getPriceAmount(data.priceFrom),
        priceTo: data.priceTo || "",
        priceToAmount: getPriceAmount(data.priceTo),
        // For backward compatibility
        price: data.priceFrom || "",
        priceAmount: getPriceAmount(data.priceFrom),

        isPopular: data.isPopular || false,
        badgeText: data.badgeText || "",
        technologies: data.technologies
          ? data.technologies.split(",").map((t) => t.trim())
          : [],
        includes: data.includes
          ? data.includes.split("\n").filter((i) => i.trim() !== "")
          : [],
        excludes: data.excludes
          ? data.excludes.split("\n").filter((i) => i.trim() !== "")
          : [],
        features: data.features
          ? data.features.split("\n").map((f) => ({
              name: f.trim(),
              available: true,
            }))
          : [],
      };

      const categoryKey = data.categoryKey;
      const updatedCategory = { ...pricingData[categoryKey] };

      if (editingPlan) {
        updatedCategory.plans = updatedCategory.plans.map((plan) =>
          plan.id === editingPlan.id ? planData : plan
        );
      } else {
        updatedCategory.plans = [...(updatedCategory.plans || []), planData];
      }

      await updatePricing(categoryKey, updatedCategory);
      toast.success(`Plan ${editingPlan ? "updated" : "added"} successfully`);

      reset();
      setShowPlanForm(false);
      setEditingPlan(null);
      fetchPricingData();
    } catch (error) {
      toast.error(`Failed to ${editingPlan ? "update" : "add"} plan`);
      console.error("Error saving plan:", error);
    }
  };

  const handleEditCategory = (key) => {
    const category = pricingData[key];
    setValue("title", category.title);
    setValue("subtitle", category.subtitle);
    setValue("icon", category.icon || "");
    setEditingCategory(key);
    setShowCategoryForm(true);
    setShowPlanForm(false);
  };

  const handleEditPlan = (categoryKey, plan) => {
    setValue("categoryKey", categoryKey);
    setValue("planName", plan.name);
    setValue("tagline", plan.tagline || "");
    setValue("priceFrom", plan.priceFrom || plan.price || "");
    setValue("priceTo", plan.priceTo || "");
    setValue("isPopular", plan.isPopular || false);
    setValue("badgeText", plan.badgeText || "");
    setValue("technologies", plan.technologies?.join(", ") || "");
    setValue("includes", plan.includes?.join("\n") || "");
    setValue("excludes", plan.excludes?.join("\n") || "");
    setValue("features", plan.features?.map((f) => f.name).join("\n") || "");

    setEditingPlan(plan);
    setShowPlanForm(true);
    setShowCategoryForm(false);
  };

  const handleDeleteCategory = async (key) => {
    if (
      window.confirm(
        "Are you sure? This will delete the category and ALL plans inside it."
      )
    ) {
      try {
        // Call the delete API
        await deletePricing(key);

        // Update local state after successful deletion
        const updatedData = { ...pricingData };
        delete updatedData[key];
        setPricingData(updatedData);

        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error(error.message || "Failed to delete category");
      }
    }
  };

  const handleDeletePlan = async (categoryKey, planId) => {
    if (window.confirm("Delete this plan?")) {
      try {
        const updatedCategory = { ...pricingData[categoryKey] };
        updatedCategory.plans = updatedCategory.plans.filter(
          (plan) => plan.id !== planId
        );

        await updatePricing(categoryKey, updatedCategory);
        fetchPricingData();
        toast.success("Plan deleted successfully");
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  // --- Render Functions ---

  const renderCategoryForm = () => (
    <div className="bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-xl mb-10 animation-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaLayerGroup className="text-[#F47C26]" />
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h3>
        <button
          onClick={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
            reset();
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitCategory)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F47C26] focus:border-transparent outline-none transition-all"
              placeholder="e.g. Web Development"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              {...register("subtitle")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F47C26] focus:border-transparent outline-none transition-all"
              placeholder="e.g. Scalable solutions..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Icon Class
            </label>
            <input
              type="text"
              {...register("icon")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F47C26] focus:border-transparent outline-none transition-all"
              placeholder="e.g. fa-rocket"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <FaSave /> {editingCategory ? "Update Category" : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderPlanForm = () => (
    <div className="bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-xl mb-10 animation-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FaTags className="text-blue-500" />
          {editingPlan ? "Edit Plan" : "Add New Plan"}
        </h3>
        <button
          onClick={() => {
            setShowPlanForm(false);
            setEditingPlan(null);
            reset();
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitPlan)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              {...register("categoryKey", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              disabled={!!editingPlan}
            >
              <option value="">Select Parent Category</option>
              {Object.keys(pricingData).map((key) => (
                <option key={key} value={key}>
                  {pricingData[key].title}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Basics */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Plan Name *
            </label>
            <input
              type="text"
              {...register("planName", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Price From *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("priceFrom", { required: true })}
                  placeholder="₹25,000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Price To (optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("priceTo")}
                  placeholder="₹50,000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Tagline
            </label>
            <input
              type="text"
              {...register("tagline")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                {...register("isPopular")}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="isPopular"
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mark as Popular
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Badge Text
            </label>
            <input
              type="text"
              {...register("badgeText")}
              placeholder="e.g. Best Value"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Technologies (Comma separated)
            </label>
            <input
              type="text"
              {...register("technologies")}
              placeholder="React, Node, AWS"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Includes (One per line)
            </label>
            <textarea
              {...register("includes")}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Excludes (One per line)
            </label>
            <textarea
              {...register("excludes")}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <FaSave /> {editingPlan ? "Update Plan" : "Save Plan"}
          </button>
        </div>
      </form>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-[#0a0f2d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F47C26]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white p-6 font-sans transition-colors duration-300">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-200/20 dark:bg-[#F47C26]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Pricing <span className="text-[#F47C26]">Management</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage categories, plans, and features.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowCategoryForm(true);
                setShowPlanForm(false);
                reset();
              }}
              className="px-5 py-2.5 bg-[#F47C26] text-white rounded-xl font-bold hover:bg-[#d5671f] transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <FaPlus /> Add Category
            </button>
            <button
              onClick={() => {
                setShowPlanForm(true);
                setShowCategoryForm(false);
                reset();
              }}
              className="px-5 py-2.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition-all flex items-center gap-2"
              disabled={Object.keys(pricingData).length === 0}
            >
              <FaPlus /> Add Plan
            </button>
          </div>
        </div>

        {/* Forms Render Area */}
        {showCategoryForm && renderCategoryForm()}
        {showPlanForm && renderPlanForm()}

        {/* Categories List */}
        <div className="space-y-10">
          {Object.entries(pricingData).map(([key, category]) => (
            <div
              key={key}
              className="bg-white dark:bg-[#0F1430] border border-gray-200 dark:border-white/10 rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gray-50 dark:bg-white/5 px-6 py-5 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-blue-500">●</span> {category.title}
                  </h2>
                  {category.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {category.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(key)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(key)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => {
                      setShowPlanForm(true);
                      setShowCategoryForm(false);
                      reset({ categoryKey: key });
                    }}
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                    title="Add Plan Here"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Plans Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
                  <thead className="bg-gray-100 dark:bg-black/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Plan Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tagline
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Popular
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#0F1430] divide-y divide-gray-200 dark:divide-white/5">
                    {category.plans?.map((plan) => (
                      <tr
                        key={plan.id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {plan.name}
                            </div>
                            {plan.badgeText && (
                              <span className="ml-2 px-2 py-0.5 inline-flex text-[10px] font-bold rounded-md bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                                {plan.badgeText}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            {plan.priceTo && plan.priceTo !== plan.priceFrom ? (
                              <>
                                <span className="text-sm font-bold text-[#F47C26]">
                                  {plan.priceFrom} - {plan.priceTo}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Starting from {plan.priceFrom}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-[#F47C26]">
                                {plan.priceFrom || plan.price}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {plan.tagline || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {plan.isPopular ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditPlan(key, plan)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(key, plan.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!category.plans || category.plans.length === 0) && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400 italic"
                        >
                          No plans found for this category yet. Click the +
                          button above to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {Object.keys(pricingData).length === 0 && !showCategoryForm && (
            <div className="bg-white dark:bg-[#0F1430] rounded-3xl shadow-xl p-12 text-center border border-gray-200 dark:border-white/10">
              <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <FaLayerGroup size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No pricing categories
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new pricing category.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowCategoryForm(true);
                    setShowPlanForm(false);
                    reset();
                  }}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-bold rounded-xl text-white bg-[#F47C26] hover:bg-[#d5671f] transition-all"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                  Create First Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingAdmin;
