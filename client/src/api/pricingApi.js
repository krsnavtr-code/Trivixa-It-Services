import { api } from './axios';

export const getPricing = async () => {
  try {
    const response = await api.get('/pricing');
    
    // Transform the data to handle both old and new price formats
    const transformedData = {};
    if (Array.isArray(response.data)) {
      response.data.forEach(category => {
        if (category.key) {
          // Transform plans to ensure they have the new price range fields
          const transformedPlans = (category.plans || []).map(plan => ({
            ...plan,
            // If priceFrom/priceTo don't exist, use the old price field for backward compatibility
            priceFrom: plan.priceFrom || plan.price,
            priceFromAmount: plan.priceFromAmount || plan.priceAmount,
            priceTo: plan.priceTo || plan.price,
            priceToAmount: plan.priceToAmount || plan.priceAmount,
            // Remove old price fields to avoid confusion
            ...(plan.price && { price: undefined }),
            ...(plan.priceAmount && { priceAmount: undefined })
          }));

          transformedData[category.key] = {
            title: category.title || category.key.charAt(0).toUpperCase() + category.key.slice(1),
            subtitle: category.subtitle || '',
            plans: transformedPlans
          };
        }
      });
      return transformedData;
    }
    
    // If not an array, return as is (should match the expected format)
    return response.data;
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    throw error;
  }
};

export const updatePricing = async (categoryData) => {
  try {
    const response = await api.post('/pricing/update', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating pricing data:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      request: error.request,
      config: error.config
    });

    // Create a more detailed error message
    const errorMessage = error.response?.data?.message || error.message;
    const detailedError = new Error(`Failed to update pricing: ${errorMessage}`);
    detailedError.status = error.response?.status;
    detailedError.response = error.response?.data;

    throw detailedError;
  }
};

/**
 * Delete a pricing category
 * @param {string} categoryKey - The key of the category to delete
 * @returns {Promise<Object>} The response data
 */
export const deletePricing = async (categoryKey) => {
  try {
    const response = await api.delete(`/pricing/${categoryKey}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting pricing category:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    const errorMessage = error.response?.data?.message || error.message;
    const detailedError = new Error(`Failed to delete pricing category: ${errorMessage}`);
    detailedError.status = error.response?.status;
    detailedError.response = error.response?.data;

    throw detailedError;
  }
};
