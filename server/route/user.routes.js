import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus
} from '../controller/user.controller.js';
import User from '../model/User.js';
import { protect, authorize } from '../middleware/auth.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

// ====================================
// Public Routes (No Authentication)
// ====================================

/**
 * @route   POST /api/users/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            role: role || 'user' // Default to 'user' role if not specified
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Error in user signup:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during signup',
            error: err.message
        });
    }
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Error in user login:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: err.message
        });
    }
});

// ====================================
// Protected Routes (Require Authentication)
// ====================================

/**
 * @route   GET /api/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
});

/**
 * @route   PUT /api/users/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/update-profile', protect, async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (email) updates.email = email;

        // Handle password change if requested
        if (currentPassword && newPassword) {
            const user = await User.findById(req.user.id).select('+password');
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(newPassword, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: err.message
        });
    }
});

// ====================================
// Admin-Only Routes
// ====================================

// Apply protect and admin middleware to all routes below
router.use(protect, authorize('admin'));

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.route('/')
    .get(getAllUsers)
    .post(createUser);

/**
 * @route   GET /api/users/:id
 * @route   PUT /api/users/:id
 * @route   DELETE /api/users/:id
 * @desc    Get/Update/Delete user (Admin only)
 * @access  Private/Admin
 */
router.route('/:id')
    .all(validateObjectId)
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Update user status (Admin only)
 * @access  Private/Admin
 */
router.route('/:id/status')
    .all(validateObjectId)
    .put(updateUserStatus);

export default router;
