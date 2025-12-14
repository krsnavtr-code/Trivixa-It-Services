import express from 'express';
import { register, login, getUserProfile, refreshToken, changePassword } from '../controller/auth.controller.js';
import { updateUser } from '../controller/user.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUser);
router.put('/change-password', protect, changePassword);

export default router;
