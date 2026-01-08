import Pricing from '../model/Pricing.model.js';

// Get all pricing data
export const getPricing = async (req, res) => {
  try {
    const pricingData = await Pricing.find({});
    
    // Convert to the format expected by the frontend
    const formattedData = {};
    pricingData.forEach(category => {
      formattedData[category.key] = {
        title: category.title,
        subtitle: category.subtitle,
        icon: category.icon,
        plans: category.plans.map(plan => ({
          id: plan.id,
          name: plan.name,
          tagline: plan.tagline,
          price: plan.price,
          isPopular: plan.isPopular,
          badgeText: plan.badgeText,
          technologies: plan.technologies,
          includes: plan.includes,
          excludes: plan.excludes,
          features: plan.features
        }))
      };
    });
    
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    res.status(500).json({ message: 'Error fetching pricing data', error: error.message });
  }
};

// Update pricing data (for admin)
export const updatePricing = async (req, res) => {
  try {
    const { categoryKey, planData } = req.body;
    
    // Find the category and update or create it
    const updatedCategory = await Pricing.findOneAndUpdate(
      { key: categoryKey },
      { 
        key: categoryKey,
        ...planData,
        $setOnInsert: { createdAt: new Date() }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating pricing data:', error);
    res.status(500).json({ message: 'Error updating pricing data', error: error.message });
  }
};
