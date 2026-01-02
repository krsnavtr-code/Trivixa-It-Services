import express from 'express';
const router = express.Router();

// Import the controller functions
import {
    createProject,
    getAllProjects,
    getProjectById,
    getProjectBySlug,
    updateProject,
    deleteProject,
    getFeaturedProjects,
    getRelatedProjects
} from '../controller/project.controller.js';

// middleware placeholder (Uncomment if you have auth middleware)
// import { protect, authorize } from '../middleware/auth.js';

/* ===========================================
   1. SPECIAL ROUTES (Must come before /:slug)
   =========================================== */

// @route   GET /api/projects/featured
// @desc    Get top featured projects for homepage
router.get('/featured', getFeaturedProjects);

/* ===========================================
   2. ROOT ROUTES
   =========================================== */

router
    .route('/')
    // @route   GET /api/projects
    // @desc    Get all projects with filtering
    .get(getAllProjects)

    // @route   POST /api/projects
    // @desc    Create a new project (Admin only)
    // .post(protect, authorize('admin'), createProject);
    .post(createProject);

/* ===========================================
   3. SINGLE PROJECT ROUTES (By Slug - SEO Friendly)
   =========================================== */

// @route   GET /api/projects/:slug
// @desc    Get single project details + increment views
router.get('/:slug', getProjectBySlug);

// @route   GET /api/projects/id/:id
// @desc    Get project by ID
router.get('/id/:id', getProjectById);

// @route   GET /api/projects/:slug/related
// @desc    Get related projects based on category
router.get('/:slug/related', getRelatedProjects);

/* ===========================================
   4. ADMIN ID ROUTES (Update/Delete by ID)
   =========================================== */

router
    .route('/:id')
    // @route   PUT /api/projects/:id
    // @desc    Update project details
    // .put(protect, authorize('admin'), updateProject);
    .put(updateProject)

    // @route   DELETE /api/projects/:id
    // @desc    Delete a project
    // .delete(protect, authorize('admin'), deleteProject);
    .delete(deleteProject);

export default router;