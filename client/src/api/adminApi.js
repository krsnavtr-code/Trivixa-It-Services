import axios from './axios';

export const getEmailRecords = async (filters = {}) => {
  try {
    const response = await axios.get('/emails', { 
      params: { 
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 10
      } 
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching email records:', error);
    throw error;
  }
};

