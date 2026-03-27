const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const adSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  section: {
    type: String,
    trim: true,
    enum: ["rent", "hire", "buy"],
    default: "rent",
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  additionalInfo: {
    type: Map,
    of: String,
  },
  mainImage: {
    type: String,
    trim: true,
  },
  subImages: {
    type: [String],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
  },
  rentFrequency: {
    type: String,
    trim: true,
    enum: ["hourly", "daily", "weekly", "monthly"],
  },
  priceType: {
    type: String,
    trim: true,
    enum: ["Fixed", "Negotiable", "Swap/Trade"],
  },
  price: {
    type: Number,
    min: 0,
  },
  hourlyRate: {
    type: Number,
    min: 0,
  },
  fixedProjectPrice: {
    type: Number,
    min: 0,
  },
  rentType: {
    type: String,
    trim: true,
    enum: ["offered", "wanted"],
  },
  isShipping: {
    type: Boolean,
    default: false,
  },
  addressLine1: {
    type: String,
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  zipCode: {
    type: String,
    trim: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  addOns: {
    type: [String],
  },
  totalAddonCharge: {
    type: Number,
    default: 0,
  },
  experienceLevel: {
    type: String,
    trim: true,
  },
  completedProjects: {
    type: String,
    trim: true,
  },
  languages: {
    type: [String],
  },
  skills: {
    type: [String],
  },
  features: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  workingMode: {
    type: String,
    trim: true,
  },
  availability: {
    type: String,
    trim: true,
  },
  serviceAtClientPlace: {
    type: Boolean,
    default: false,
  },
  country: {
    type: String,
    trim: true,
  },
  timeZone: {
    type: String,
    trim: true,
  },
  workingHours: {
    type: String,
    trim: true,
  },
  area: {
    type: String,
    trim: true,
  },
  coverageRadius: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  portfolioItems: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  packages: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  faqs: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  // removed business/investment-specific metrics since those sections are gone
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "active", "blocked", "inactive", "expired"],
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  approvedDate: {
    type: Date,
  },
  expirationDate: {
    type: Date,
  },
});

adSchema.plugin(toJSON);
adSchema.plugin(paginate);

const Ad = mongoose.model("Ad", adSchema);
module.exports = Ad;
