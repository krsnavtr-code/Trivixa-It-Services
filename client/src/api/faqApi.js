import api from './axios'; 

// Get public FAQs (Active only)
export const getPublicFAQs = async () => {
    const response = await api.get('/faqs');
    return response.data;
};

// Get All FAQs (Admin - Pagination, Search, Sort)
export const getAllFAQs = async (params = {}) => {
    const { page = 1, limit = 100, search = '', status = '' } = params;

    // Construct query string
    const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status && { status })
    }).toString();

    const response = await api.get(`/faqs?${queryParams}`);
    return response.data;
};

// Create new FAQ
export const createFAQ = async (data) => {
    const response = await api.post('/faqs', data);
    return response.data;
};

// Update existing FAQ
export const updateFAQ = async (id, data) => {
    const response = await api.put(`/faqs/${id}`, data);
    return response.data;
};

// Delete FAQ
export const deleteFAQ = async (id) => {
    const response = await api.delete(`/faqs/${id}`);
    return response.data;
};

// Update Sort Order
export const updateFAQOrder = async (orderedIds) => {
    const response = await api.put('/faqs/update-order', { orderedIds });
    return response.data;
};