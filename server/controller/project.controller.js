import Project from '../model/Project.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
// Helper function to process arrays from string or array input
const processArrayInput = (input) => {
    if (!input) return [];
    
    try {
        // If it's a string, try to parse it as JSON
        if (typeof input === 'string') {
            // Handle both JSON string and comma-separated values
            if (input.trim().startsWith('[')) {
                input = JSON.parse(input);
            } else if (input.includes(',')) {
                // Handle comma-separated string
                return input
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
            } else if (input.trim() !== '') {
                // Handle single value
                return [input.trim()];
            } else {
                return [];
            }
        }
        
        // Handle array of objects (like for gallery)
        if (Array.isArray(input) && input.length > 0 && typeof input[0] === 'object') {
            return input.map(item => String(item));
        }
        
        // Ensure it's an array
        if (!Array.isArray(input)) {
            return [];
        }
        
        // Convert all items to strings and filter out empty values
        return input
            .map(item => {
                if (item === null || item === undefined) return null;
                if (typeof item === 'object') {
                    return String(item._id || item);
                }
                return String(item);
            })
            .filter(Boolean);
            
    } catch (err) {
        console.error('Error processing array input:', err);
        return [];
    }
};

// Alias for backward compatibility
const processSubCategories = processArrayInput;

export const createProject = async (req, res) => {
    try {
        // Process subcategories and services
        req.body.subCategories = processSubCategories(req.body.subCategories);
        req.body.servicesProvided = processArrayInput(req.body.servicesProvided);
        
        // Log the processed data for debugging
        console.log('Creating project with data:', {
            ...req.body,
            subCategories: req.body.subCategories,
            servicesProvided: req.body.servicesProvided
        });

        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (err) {
        // Handle duplicate key error (e.g., if title already exists)
        if (err.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                error: 'A project with this title or slug already exists.' 
            });
        }
        console.error('Error creating project:', err);
        res.status(400).json({ 
            success: false, 
            error: err.message 
        });
    }
};

/**
 * @desc    Get all projects (with Filtering, Sorting & Pagination)
 * @route   GET /api/projects
 * @access  Public
 * @usage   /api/projects?category=Mobile%20App&sort=-createdAt
 */
export const getAllProjects = async (req, res) => {
    try {
        let query;

        // 1. Copy req.query
        const reqQuery = { ...req.query };

        // 2. Fields to exclude from filtering (handled separately)
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        // 3. Create query string for advanced filtering (gt, gte, etc.)
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // 4. Base Finding Resource
        // Only show 'Public' projects unless 'visibility' is explicitly requested by Admin
        let filter = JSON.parse(queryStr);
        if (!req.query.visibility) {
            filter.visibility = 'Public';
        }

        // 5. Search Functionality (Search by Title or Tech Stack)
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { 'techStack.name': searchRegex },
                { industry: searchRegex }
            ];
        }

        query = Project.find(filter);

        // 6. Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // 7. Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Default sort: By custom SortOrder (asc) then CreatedAt (desc)
            query = query.sort('sortOrder -createdAt');
        }

        // 8. Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Project.countDocuments(filter);

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const projects = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: projects.length,
            pagination,
            data: projects
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/id/:id
 * @access  Public
 */
export const getProjectById = async (req, res) => {
    try {
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, error: 'Invalid project ID format' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Increment views and update last viewed time
        project.views += 1;
        project.lastViewedAt = Date.now();
        await project.save();

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Get single project by Slug & Increment Views
 * @route   GET /api/projects/:slug
 * @access  Public
 */
export const getProjectBySlug = async (req, res) => {
    try {
        // Find project and increment 'views' by 1 atomically
        const project = await Project.findOneAndUpdate(
            { slug: req.params.slug },
            {
                $inc: { views: 1 },
                $set: { lastViewedAt: Date.now() }
            },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
export const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Process subcategories, services, and gallery
        if (req.body.subCategories) {
            req.body.subCategories = processSubCategories(req.body.subCategories);
        }
        if (req.body.servicesProvided) {
            req.body.servicesProvided = processArrayInput(req.body.servicesProvided);
        }
        if (req.body.gallery) {
            req.body.gallery = processArrayInput(req.body.gallery);
        }
        
        // Log the processed data for debugging
        console.log('Updating project with data:', {
            ...req.body,
            subCategories: req.body.subCategories,
            servicesProvided: req.body.servicesProvided,
            gallery: req.body.gallery
        });

        // Update fields manually to trigger middleware (for slug regeneration)
        Object.keys(req.body).forEach(key => {
            // Only update fields that are in the request body
            if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
                project[key] = req.body[key];
            }
        });

        await project.save(); // This triggers the slugify pre-save hook

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(400).json({ 
            success: false, 
            error: err.message 
        });
    }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Get Featured Projects (For Home Page Carousel)
 * @route   GET /api/projects/featured
 * @access  Public
 */
export const getFeaturedProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            isFeatured: true,
            visibility: 'Public'
        })
            .sort('sortOrder -createdAt')
            .limit(6); // Limit to top 6 featured items

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Get Related Projects (Based on Category/Industry)
 * @route   GET /api/projects/:slug/related
 * @access  Public
 */
export const getRelatedProjects = async (req, res) => {
    try {
        // 1. Get the current project to find its category
        const currentProject = await Project.findOne({ slug: req.params.slug });

        if (!currentProject) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // 2. Find other projects in same category, excluding current one
        const related = await Project.find({
            category: currentProject.category,
            _id: { $ne: currentProject._id }, // Not Equal to current ID
            visibility: 'Public'
        })
            .limit(3)
            .select('title slug thumbnail category industry');

        res.status(200).json({
            success: true,
            data: related
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};