import express from 'express';
import { checkImageUsage } from '../controller/media.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/media/check-usage
 * @desc    Check if an image is being used in the system
 * @access  Private/Admin
 * @query   {string} url - The URL of the image to check
 */
router.route('/check-usage')
    .get(protect, authorize('admin'), checkImageUsage);

export default router;
