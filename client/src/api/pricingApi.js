import { api } from './axios';

export const getPricing = async () => {
  try {
    const response = await api.get('/pricing');
    
    // Transform the data to match the expected format
    const transformedData = {};
    if (Array.isArray(response.data)) {
      response.data.forEach(category => {
        if (category.key) {
          transformedData[category.key] = {
            title: category.title || category.key.charAt(0).toUpperCase() + category.key.slice(1),
            subtitle: category.subtitle || '',
            plans: category.plans || []
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

export const updatePricing = async (categoryKey, planData) => {
  try {
    const response = await api.post('/pricing/update', { categoryKey, planData });
    return response.data;
  } catch (error) {
    console.error('Error updating pricing data:', error);
    throw error;
  }
};
