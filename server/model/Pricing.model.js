import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tagline: String,

  priceFrom: String,
  priceFromAmount: Number,
  priceTo: String,
  priceToAmount: Number,
  currency: { type: String, default: "INR" },
  billingType: {
    type: String,
    enum: ["one-time", "monthly", "yearly"],
    default: "one-time"
  },

  isPopular: { type: Boolean, default: false },
  badgeText: String,

  deliveryTime: String,
  revisions: { type: Number, default: 0 },
  pagesIncluded: Number,
  screensIncluded: Number,
  supportDuration: String,

  technologies: [String],
  includes: [String],
  excludes: [String],

  features: [{
    name: String,
    available: { type: Boolean, default: true }
  }],

  sourceCodeAccess: { type: Boolean, default: true },
  adminPanelAccess: { type: Boolean, default: false },
  hostingIncluded: { type: Boolean, default: false },
  domainIncluded: { type: Boolean, default: false },

  securityFeatures: [String],
  backupPolicy: String,
  uptimeGuarantee: String,
  sla: String,

  highlights: [String],
  ctaText: { type: String, default: "Get Started" },

  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  },

  orderPriority: { type: Number, default: 0 },

  discount: {
    enabled: { type: Boolean, default: false },
    percentage: Number,
    validTill: Date
  },

  enquiryCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },

  lastUpdatedBy: String
});

const pricingCategorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: String,
  icon: String,
  plans: [pricingPlanSchema]
}, { timestamps: true });

export default mongoose.model('Pricing', pricingCategorySchema);
