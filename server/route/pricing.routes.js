import express from 'express';
import { getPricing, updatePricing } from '../controller/pricing.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPricing);

// Protected admin routes
router.post('/update', protect, authorize('admin'), updatePricing);

export default router;
