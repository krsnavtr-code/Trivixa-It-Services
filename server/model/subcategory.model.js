import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    // Link to Parent Category
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Must match the model name exported in Category.js
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true
    },

    image: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// 1. Compound Index: Ensures unique names per category
// (e.g. You can have "Design" under "Web" AND "Design" under "Graphic", but not duplicate "Design" under "Web")
subCategorySchema.index({ category: 1, name: 1 }, { unique: true });

// 2. Auto-generate Slug from Name
subCategorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        // Simple slugify: lowercase and replace spaces with dashes
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    next();
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;