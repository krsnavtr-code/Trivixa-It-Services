import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { generateCoursePDF, sendCoursePdfToStudent, downloadCourseBrochure } from '../controller/pdf.controller.js';

const router = express.Router();

// @route   GET /api/pdfs
// @desc    Get list of available PDFs
// @access  Private/Admin
router.get('/:id/generate-pdf', protect, restrictTo('admin'), generateCoursePDF);

// @route   POST /api/pdfs/send-brochure
// @desc    Send a brochure via email
// @access  Private/Admin
router.post('/:id/send-pdf', protect, restrictTo('admin'), sendCoursePdfToStudent);
router.get('/:id/download-brochure', protect, downloadCourseBrochure);

export default router;
