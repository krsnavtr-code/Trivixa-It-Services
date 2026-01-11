import Pricing from '../model/Pricing.model.js';

// ===============================
// GET ALL PRICING (Frontend)
// ===============================
export const getPricing = async (req, res) => {
  try {
    const pricingData = await Pricing.find({});

    const formattedData = {};

    pricingData.forEach(category => {
      formattedData[category.key] = {
        title: category.title,
        subtitle: category.subtitle,
        icon: category.icon,
        plans: category.plans
          .filter(plan => plan.visibility === "public")
          .sort((a, b) => a.orderPriority - b.orderPriority)
          .map(plan => ({
            id: plan.id,
            name: plan.name,
            tagline: plan.tagline,

            priceFrom: plan.priceFrom,
            priceFromAmount: plan.priceFromAmount,
            priceTo: plan.priceTo,
            priceToAmount: plan.priceToAmount,
            currency: plan.currency,
            billingType: plan.billingType,

            isPopular: plan.isPopular,
            badgeText: plan.badgeText,

            deliveryTime: plan.deliveryTime,
            revisions: plan.revisions,
            pagesIncluded: plan.pagesIncluded,
            screensIncluded: plan.screensIncluded,
            supportDuration: plan.supportDuration,

            technologies: plan.technologies,
            includes: plan.includes,
            excludes: plan.excludes,
            features: plan.features,
            highlights: plan.highlights,

            sourceCodeAccess: plan.sourceCodeAccess,
            adminPanelAccess: plan.adminPanelAccess,
            hostingIncluded: plan.hostingIncluded,
            domainIncluded: plan.domainIncluded,

            securityFeatures: plan.securityFeatures,
            backupPolicy: plan.backupPolicy,
            uptimeGuarantee: plan.uptimeGuarantee,
            sla: plan.sla,

            discount: plan.discount,
            ctaText: plan.ctaText
          }))
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    res.status(500).json({
      message: 'Error fetching pricing data',
      error: error.message
    });
  }
};


// ===============================
// CREATE / UPDATE PRICING (ADMIN)
// ===============================
export const updatePricing = async (req, res) => {
  try {
    console.log('Received update request with body:', JSON.stringify(req.body, null, 2));

    const {
      categoryKey,
      title,
      subtitle = '',
      icon = 'default-icon',
      plans = []
    } = req.body;

    if (!categoryKey || !title) {
      console.error('Validation failed - missing required fields:', { categoryKey, title });
      return res.status(400).json({
        success: false,
        message: "categoryKey and title are required",
        received: { categoryKey, title }
      });
    }

    const updateData = {
      key: categoryKey,
      title,
      subtitle,
      icon,
      plans,
      updatedAt: new Date()
    };

    console.log('Attempting to update with data:', JSON.stringify(updateData, null, 2));

    const updatedCategory = await Pricing.findOneAndUpdate(
      { key: categoryKey },
      updateData,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      message: "Pricing updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({
      message: 'Error updating pricing',
      error: error.message
    });
  }
};

// ===============================
// DELETE PRICING CATEGORY (ADMIN)
// ===============================
export const deletePricing = async (req, res) => {
  try {
    const { categoryKey } = req.params;

    if (!categoryKey) {
      return res.status(400).json({
        success: false,
        message: "categoryKey is required"
      });
    }

    const result = await Pricing.deleteOne({ key: categoryKey });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting pricing category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting pricing category',
      error: error.message
    });
  }
};

// ===============================
// INCREMENT PLAN ENQUIRY
// ===============================
export const incrementPlanEnquiry = async (req, res) => {
  try {
    const { categoryKey, planId } = req.params;

    const category = await Pricing.findOneAndUpdate(
      { key: categoryKey, "plans.id": planId },
      { $inc: { "plans.$.enquiryCount": 1 } },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Enquiry recorded" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update enquiry count",
      error: error.message
    });
  }
};
