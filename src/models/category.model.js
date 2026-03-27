const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  subCategories: [this],
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  icon: {
    type: String,
    trim: true,
    required: true,
  },
  // Which top-level sections this category applies to (optional).
  // If empty or missing, category is considered global and shown under all sections.
  sections: {
    type: [String],
    enum: ['rent', 'hire', 'buy'],
    default: undefined,
  },
  subCategories: [subCategorySchema],
});

categorySchema.plugin(toJSON);

/**
 * Check if category name is taken
 * @param {string} name - The category's name
 * @param {ObjectId} [excludeCategoryId] - The id of the category to be excluded
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isCategoryExist = async function (name, excludeCategoryId) {
  const category = await this.findOne({ name, _id: { $ne: excludeCategoryId } });
  return !!category;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
