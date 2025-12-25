import express from "express";
import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getAllSubCategories,
    getSubCategoryById
} from "../controller/subcategory.controller.js";  
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

// --- 1. Middleware: Validate MongoDB ObjectId ---
const validateObjectId = (paramName = 'id') => [
    param(paramName)
        .trim()
        .notEmpty()
        .withMessage(`${paramName} is required`)
        .bail()
        .isLength({ min: 24, max: 24 })
        .withMessage(`${paramName} must be 24 characters long`)
        .bail()
        .matches(/^[0-9a-fA-F]+$/)
        .withMessage(`${paramName} must be a valid hexadecimal string`)
        .bail()
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error(`Invalid ${paramName} format`);
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

// --- 2. Middleware: Validate SubCategory Input ---
const validateSubCategory = [
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Parent Category ID is required')
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Parent Category ID format');
            }
            return true;
        }),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('description')
        .trim()
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters')
];

// --- 3. Routes ---

// GET All (Public) - Supports filtering by categoryId
router.get('/',
    [
        query('categoryId').optional().isMongoId().withMessage('Invalid Category ID format'),
        query('limit').optional().isInt({ min: 1 }).toInt(),
        query('page').optional().isInt({ min: 1 }).toInt()
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
    getAllSubCategories
);

// GET Single (Public)
router.get('/:id',
    validateObjectId('id'),
    getSubCategoryById
);

// POST Create (Admin Only)
router.post('/',
    isAdmin,
    validateSubCategory,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Boolean conversion for FormData/Multipart requests
        if (req.body.isActive !== undefined) {
            req.body.isActive = String(req.body.isActive).toLowerCase() === 'true';
        }

        console.log('Processed create subcategory data:', req.body);
        next();
    },
    createSubCategory
);

// PUT Update (Admin Only)
router.put('/:id',
    isAdmin,
    validateObjectId('id'),
    [
        // Validate inputs if they exist (partial updates allowed)
        body('category').optional().isMongoId().withMessage('Invalid Parent Category ID'),
        body('name').optional().trim().isLength({ min: 2, max: 50 }),
        body('description').optional().trim().isLength({ max: 500 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        if (req.body.isActive !== undefined) {
            req.body.isActive = String(req.body.isActive).toLowerCase() === 'true';
        }

        console.log('Processed update subcategory data:', req.body);
        next();
    },
    updateSubCategory
);

// DELETE (Admin Only)
router.delete('/:id',
    isAdmin,
    validateObjectId('id'),
    deleteSubCategory
);

export default router;