const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const featuredCategorySchema = mongoose.Schema(
  {
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
featuredCategorySchema.plugin(toJSON);
featuredCategorySchema.plugin(paginate);

/**
 * @typedef FeaturedCategory
 */
const FeaturedCategory = mongoose.model('FeaturedCategory', featuredCategorySchema);

module.exports = FeaturedCategory;
