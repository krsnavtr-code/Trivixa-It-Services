import api from './axios';

// Get all projects
// Get all projects
export const getProjects = async (filters = {}) => {
    try {
        const response = await api.get('/projects', { params: filters });
        if (response.data) {
            return {
                success: true,
                data: response.data.data || [],
                pagination: response.data.pagination || { total: response.data.data?.length || 0 }
            };
        }
        throw new Error('Failed to fetch projects');
    } catch (error) {
        console.error('Error fetching projects:', error);
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

        console.log('Sending project data:', requestData); 

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