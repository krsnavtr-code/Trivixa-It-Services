import mongoose from 'mongoose';

const mediaTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Tag name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  mediaCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name before saving
mediaTagSchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();
  
  // Create slug from name
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .trim();
    
  next();
});

// Prevent duplicate slugs
mediaTagSchema.index({ slug: 1 }, { unique: true });

// Virtual for media items associated with this tag
mediaTagSchema.virtual('mediaItems', {
  ref: 'Media',
  localField: '_id',
  foreignField: 'tags'
});

const MediaTag = mongoose.model('MediaTag', mediaTagSchema);

export default MediaTag;
