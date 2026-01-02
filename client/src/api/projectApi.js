import api from './axios';

// Get all projects
export const getProjects = async (filters = {}) => {
    try {
        // console.log('Fetching projects with filters:', filters);

        // Make sure we're not sending undefined or null values
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});

        // console.log('Sending request to /projects with params:', cleanFilters);
        const response = await api.get('/projects', {
            params: cleanFilters,
            paramsSerializer: params => {
                return Object.entries(params)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');
            }
        });

        // console.log('Projects API response:', response);

        // Handle different response formats
        let projects = [];
        if (Array.isArray(response.data)) {
            projects = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            projects = response.data.data;
        } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
            projects = response.data.results;
        }

        // console.log('Extracted projects:', projects);

        return {
            success: true,
            data: projects,
            pagination: response.data.pagination || {
                total: projects.length,
                page: 1,
                limit: projects.length
            }
        };
    } catch (error) {
        console.error('Error fetching projects:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config
        });

        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch projects',
            data: [],
            pagination: { total: 0 }
        };
    }
};

// Get a single project by ID
export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/projects/id/${id}`);
        if (response.data) {
            return {
                success: true,
                data: response.data.data || null
            };
        }
        throw new Error('Invalid response');
    } catch (error) {
        console.error(`Error fetching project ${id}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || 'Project not found',
            data: null
        };
    }
};

// Create a new project
export const createProject = async (projectData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        let requestData = projectData;
        
        // If it's FormData, convert to plain object
        if (projectData instanceof FormData) {
            requestData = {};
            // Convert FormData entries to a plain object
            for (let [key, value] of projectData.entries()) {
                // Try to parse JSON strings (like gallery array)
                try {
                    requestData[key] = JSON.parse(value);
                } catch (e) {
                    // If not JSON, keep original value
                    requestData[key] = value;
                }
            }
        }

        // console.log('Sending project data:', requestData); 

        const response = await api.post('/projects', requestData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating project:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        throw error;
    }
};

// Update existing project
export const updateProject = async (id, projectData) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        let requestData = projectData;
        
        // If it's FormData, convert to plain object
        if (projectData instanceof FormData) {
            requestData = {};
            // Convert FormData entries to a plain object
            for (let [key, value] of projectData.entries()) {
                // Try to parse JSON strings (like gallery array)
                try {
                    requestData[key] = JSON.parse(value);
                } catch (e) {
                    // If not JSON, keep original value
                    requestData[key] = value;
                }
            }
        }
        
        const response = await api.put(`/projects/${id}`, requestData, config);
        return response.data;
    } catch (error) {
        console.error(`Error updating project ${id}:`, {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

// Delete a project
export const deleteProject = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };
        const response = await api.delete(`/projects/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Error deleting project ${id}:`, error);
        throw error;
    }
};