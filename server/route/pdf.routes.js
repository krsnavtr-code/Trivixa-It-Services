import express from 'express';
import { generateCoursePDF, sendCoursePdfToStudent, downloadCourseBrochure } from '../controller/pdf.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate PDF for a course
router.route('/services/:id/generate-pdf')
    .get(protect, admin, generateCoursePDF);

// Send course PDF to student's email
router.route('/services/:id/send-pdf')
    .post(protect, admin, sendCoursePdfToStudent);

// Download course brochure (public access)
router.route('/services/:id/download-brochure')
    .get(downloadCourseBrochure);

export default router;
