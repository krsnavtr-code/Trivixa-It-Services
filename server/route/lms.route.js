import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  enrollInCourse,
  getMyEnrollments,
  getCourseContent,
  updateLessonProgress,
  generateCertificate
} from '../controller/lms.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Enroll in a course
router.post('/services/:courseId/enroll', enrollInCourse);

// Get user's enrollments
router.get('/my-courses', getMyEnrollments);

// Get course content
router.get('/services/:courseId/content', getCourseContent);

// Update lesson progress
router.post('/services/:courseId/lessons/:lessonId/progress', updateLessonProgress);

// Generate certificate
router.post('/services/:courseId/certificate', generateCertificate);

export default router;
