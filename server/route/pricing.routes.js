import express from 'express';
import {
    getPricing,
    updatePricing,
    deletePricing,
    incrementPlanEnquiry
} from '../controller/pricing.controller.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/* ===============================
   PUBLIC ROUTES
================================ */

// Get all pricing (Frontend)
router.get('/', getPricing);

// Track enquiry when user clicks CTA
router.post('/:categoryKey/:planId/enquiry', incrementPlanEnquiry);


/* ===============================
   ADMIN ROUTES
================================ */

// Create / Update pricing category & plans
router.post(
    '/update',
    protect,
    authorize('admin'),
    updatePricing
);

// Delete pricing category
router.delete(
    '/:categoryKey',
    protect,
    authorize('admin'),
    deletePricing
);

export default router;
