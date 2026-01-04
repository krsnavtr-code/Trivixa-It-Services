import Project from "../model/Project.model.js";
import Category from "../model/category.model.js";
import Service from "../model/services.model.js";

/**
 * @desc    Check if an image is being used in the system
 * @route   GET /api/media/check-usage
 * @access  Private/Admin
 * @param   {string} url - The URL of the image to check
 * @returns {Object} Object containing usage information
 */
export const checkImageUsage = async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'Image URL is required'
            });
        }

        // Extract the filename from the URL
        const filename = url.split('/').pop();
        
        // Search in Projects
        const projectUsage = await checkProjectsForImage(filename);
        
        // Search in Categories
        const categoryUsage = await checkCategoriesForImage(filename);
        
        // Search in Services
        const serviceUsage = await checkServicesForImage(filename);

        const isUsed = projectUsage.found || categoryUsage.found || serviceUsage.found;

        res.status(200).json({
            success: true,
            data: {
                isUsed,
                usageDetails: {
                    projects: projectUsage,
                    categories: categoryUsage,
                    services: serviceUsage
                }
            }
        });

    } catch (error) {
        console.error('Error checking image usage:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while checking image usage'
        });
    }
};

// Helper function to check image usage in Projects
const checkProjectsForImage = async (filename) => {
    const imageFields = [
        'thumbnail',
        'heroImage',
        'gallery',
        'testimonial.avatar',
        'seo.ogImage'
    ];

    const query = {
        $or: [
            { thumbnail: { $regex: filename, $options: 'i' } },
            { heroImage: { $regex: filename, $options: 'i' } },
            { 'gallery': { $regex: filename, $options: 'i' } },
            { 'testimonial.avatar': { $regex: filename, $options: 'i' } },
            { 'seo.ogImage': { $regex: filename, $options: 'i' } }
        ]
    };

    const projects = await Project.find(query).select('title slug');
    
    return {
        found: projects.length > 0,
        count: projects.length,
        items: projects
    };
};

// Helper function to check image usage in Categories
const checkCategoriesForImage = async (filename) => {
    const categories = await Category.find({
        $or: [
            { image: { $regex: filename, $options: 'i' } }
        ]
    }).select('name slug');
    
    return {
        found: categories.length > 0,
        count: categories.length,
        items: categories
    };
};

// Helper function to check image usage in Services
const checkServicesForImage = async (filename) => {
    const services = await Service.find({
        $or: [
            { image: { $regex: filename, $options: 'i' } },
            { 'instructors.image': { $regex: filename, $options: 'i' } }
        ]
    }).select('title slug');
    
    return {
        found: services.length > 0,
        count: services.length,
        items: services
    };
};
