import api from './axios';

// Get all subcategories with optional pagination and filtering
export const getSubCategories = async (params = {}) => {
    try {
        // Default parameters
        const defaultParams = {
            limit: 25,
            page: 1,
            sort: 'name',
            fields: '_id,name,description,category,image,isActive,createdAt', // Added 'category' field
        };

        // Merge default params with provided params
        const requestParams = {
            ...defaultParams,
            ...params,
            // Only include specific filters if explicitly set
            ...(params.status && { status: params.status }),
            ...(params.categoryId && { categoryId: params.categoryId }) // Add filtering by Parent Category
        };

        // Remove undefined values
        Object.keys(requestParams).forEach(key => {
            if (requestParams[key] === undefined || requestParams[key] === '') {
                delete requestParams[key];
            }
        });

        // console.log('Fetching subcategories with params:', requestParams);
        const response = await api.get('/subcategories', { params: requestParams });

        // Return the backend response directly
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }
};

// Get a single subcategory by ID
export const getSubCategoryById = async (id) => {
    try {
        const response = await api.get(`/subcategories/${id}`);
        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error('Invalid response format from server');
    } catch (error) {
        console.error(`Error fetching subcategory with ID ${id}:`, error);
        throw error;
    }
};

// Create a new subcategory
export const createSubCategory = async (formData) => {
    try {
        // Get the current token
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const headers = { 'Authorization': `Bearer ${token}` };
        const isFormData = formData instanceof FormData;

        if (!isFormData) headers['Content-Type'] = 'application/json';

        const config = { headers };
        const response = await api.post('/subcategories', formData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        if (error.response) {
            // Attach backend validation errors if present
            if (error.response.data && error.response.data.errors) {
                error.message = error.response.data.message || 'Validation failed';
                error.validationErrors = error.response.data.errors;
            }
        }
        throw error;
    }
};

// Update an existing subcategory
export const updateSubCategory = async (id, formData) => {
    try {
        const config = { headers: {} };

        // Set Content-Type only if not FormData
        if (!(formData instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        const token = localStorage.getItem('token');
        if (token) {
            const cleanedToken = token.trim();
            config.headers.Authorization = cleanedToken.startsWith('Bearer ')
                ? cleanedToken
                : `Bearer ${cleanedToken}`;
        }

        const response = await api.put(`/subcategories/${id}`, formData, config);
        return response.data;
    } catch (error) {
        console.error(`Error updating subcategory with ID ${id}:`, error);
        throw error;
    }
};

// Delete a subcategory
export const deleteSubCategory = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        const response = await api.delete(`/subcategories/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Error deleting subcategory with ID ${id}:`, error);
        throw error;
    }
};