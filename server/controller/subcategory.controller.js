import mongoose from 'mongoose';
import SubCategory from "../model/subCategory.model.js";
import Category from "../model/category.model.js"; // Needed to validate parent category
import { validationResult } from 'express-validator';

// Get all subcategories with optional filters
export const getAllSubCategories = async (req, res) => {
    try {
        // Extract query params from request
        const { status, categoryId, fields, sort, limit = 10, page = 1 } = req.query;

        // Build query
        const query = {};
        if (status) query.isActive = status === 'true';
        if (categoryId) query.category = categoryId; // Filter by Parent Category

        // Build projection
        const projection = fields ? fields.split(',').join(' ') : {};

        // Build sort
        const sortOptions = sort ? { [sort]: 1 } : { name: 1 };

        // Pagination
        const skip = (page - 1) * limit;

        // Get total count
        const total = await SubCategory.countDocuments(query);

        // Build query builder & Populate Parent Category
        let queryBuilder = SubCategory.find(query, projection)
            .populate('category', 'name slug') // <--- Attach Parent Category Info
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Execute query
        const subCategories = await queryBuilder.lean();

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: subCategories,
            pagination: {
                total,
                totalPages,
                currentPage: parseInt(page),
                limit: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error in getAllSubCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const createSubCategory = async (req, res) => {
    try {
        console.log('Received create subcategory request with body:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { category: categoryId, name, description, isActive = true, image } = req.body;

        // 1. Verify Parent Category Exists
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: 'Invalid Category ID' });
        }

        const parentCategory = await Category.findById(categoryId);
        if (!parentCategory) {
            return res.status(404).json({ success: false, message: 'Parent Category not found' });
        }

        // 2. Check Duplicate (Name must be unique within the same Category)
        const existingSub = await SubCategory.findOne({ name, category: categoryId });
        if (existingSub) {
            return res.status(400).json({
                success: false,
                message: 'SubCategory with this name already exists in this category'
            });
        }

        // 3. Save SubCategory
        const subCategory = new SubCategory({
            category: categoryId,
            name,
            description: description || '',
            isActive,
            image: image || null
        });

        const savedSubCategory = await subCategory.save();
        console.log('SubCategory created successfully:', savedSubCategory);

        res.status(201).json({
            success: true,
            data: savedSubCategory
        });

    } catch (error) {
        console.error('Error creating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subcategory ID format',
                error: 'INVALID_ID_FORMAT'
            });
        }

        // Verify existence
        const existingSub = await SubCategory.findById(id);
        if (!existingSub) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found',
                error: 'SUBCATEGORY_NOT_FOUND'
            });
        }

        const { category, name, description, isActive, image } = req.body;

        // Check for Duplicates (Only if name or category is changing)
        if ((name && name !== existingSub.name) || (category && category !== existingSub.category.toString())) {
            const targetCategory = category || existingSub.category;
            const targetName = name || existingSub.name;

            const duplicate = await SubCategory.findOne({
                name: targetName,
                category: targetCategory
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: 'A subcategory with this name already exists in the selected category',
                    error: 'DUPLICATE_SUBCATEGORY_NAME'
                });
            }
        }

        // Build update object
        const updateData = {};
        if (category !== undefined) {
            // Verify new parent category exists
            const parentExists = await Category.findById(category);
            if (!parentExists) return res.status(404).json({ success: false, message: 'New Parent Category not found' });
            updateData.category = category;
        }
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (image !== undefined) updateData.image = image;

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('category', 'name');

        return res.json({
            success: true,
            message: 'SubCategory updated successfully',
            data: updatedSubCategory
        });

    } catch (error) {
        console.error('Error updating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating subcategory',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const deleteSubCategory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const subCategory = await SubCategory.findById(id).session(session);
        if (!subCategory) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: 'SubCategory not found' });
        }

        await SubCategory.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.json({
            success: true,
            message: 'SubCategory deleted successfully',
            data: { _id: subCategory._id, name: subCategory.name }
        });

    } catch (error) {
        console.error('Error deleting subcategory:', error);
        if (session.inTransaction()) await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};

export const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        const subCategory = await SubCategory.findById(id).populate('category', 'name description');

        if (!subCategory) {
            return res.status(404).json({ success: false, message: 'SubCategory not found' });
        }

        res.json({
            success: true,
            data: subCategory
        });
    } catch (error) {
        console.error('Error fetching subcategory:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};