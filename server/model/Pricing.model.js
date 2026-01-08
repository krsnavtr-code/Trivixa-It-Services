import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tagline: String,
  price: String,
  isPopular: { type: Boolean, default: false },
  badgeText: String,
  technologies: [String],
  includes: [String],
  excludes: [String],
  features: [{
    name: String,
    available: { type: Boolean, default: true }
  }]
});

const pricingCategorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: String,
  icon: String,
  plans: [pricingPlanSchema]
}, { timestamps: true });

export default mongoose.model('Pricing', pricingCategorySchema);
