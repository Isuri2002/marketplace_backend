const httpStatus = require('http-status');
const { FeaturedCategory, Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create featured category
 * @param {Object} featuredCategoryData
 * @returns {Promise<FeaturedCategory>}
 */
const createFeaturedCategory = async (featuredCategoryData) => {
  // Check if category exists
  const category = await Category.findById(featuredCategoryData.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Check if category is already featured
  const existingFeatured = await FeaturedCategory.findOne({ category: featuredCategoryData.categoryId });
  if (existingFeatured) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category is already featured');
  }

  // Get the highest display order and increment
  const lastFeatured = await FeaturedCategory.findOne().sort({ displayOrder: -1 });
  const displayOrder = lastFeatured ? lastFeatured.displayOrder + 1 : 1;

  const featuredCategory = await FeaturedCategory.create({
    category: featuredCategoryData.categoryId,
    image: featuredCategoryData.image,
    displayOrder,
  });

  return featuredCategory.populate('category');
};

/**
 * Query featured categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryFeaturedCategories = async (filter, options) => {
  const featuredCategories = await FeaturedCategory.paginate(filter, {
    ...options,
    populate: 'category',
    sortBy: options.sortBy || 'displayOrder:asc',
  });
  return featuredCategories;
};

/**
 * Get all featured categories (no pagination)
 * @returns {Promise<FeaturedCategory[]>}
 */
const getAllFeaturedCategories = async () => {
  const featuredCategories = await FeaturedCategory.find({ isActive: true }).populate('category').sort({ displayOrder: 1 });
  return featuredCategories;
};

/**
 * Get featured category by id
 * @param {ObjectId} id
 * @returns {Promise<FeaturedCategory>}
 */
const getFeaturedCategoryById = async (id) => {
  const featuredCategory = await FeaturedCategory.findById(id).populate('category');
  if (!featuredCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Featured category not found');
  }
  return featuredCategory;
};

/**
 * Get categories that are not featured
 * @returns {Promise<Category[]>}
 */
const getNotFeaturedCategories = async () => {
  const featuredCategoryIds = await FeaturedCategory.find().distinct('category');
  const notFeaturedCategories = await Category.find({
    _id: { $nin: featuredCategoryIds },
  });
  return notFeaturedCategories;
};

/**
 * Update featured category
 * @param {ObjectId} featuredCategoryId
 * @param {Object} updateBody
 * @returns {Promise<FeaturedCategory>}
 */
const updateFeaturedCategory = async (featuredCategoryId, updateBody) => {
  const featuredCategory = await getFeaturedCategoryById(featuredCategoryId);

  if (updateBody.image) {
    featuredCategory.image = updateBody.image;
  }
  if (updateBody.displayOrder !== undefined) {
    featuredCategory.displayOrder = updateBody.displayOrder;
  }
  if (updateBody.isActive !== undefined) {
    featuredCategory.isActive = updateBody.isActive;
  }

  await featuredCategory.save();
  return featuredCategory.populate('category');
};

/**
 * Delete featured category
 * @param {ObjectId} featuredCategoryId
 * @returns {Promise<FeaturedCategory>}
 */
const deleteFeaturedCategory = async (featuredCategoryId) => {
  const featuredCategory = await getFeaturedCategoryById(featuredCategoryId);
  await featuredCategory.remove();
  return featuredCategory;
};

/**
 * Reorder featured categories
 * @param {Array} orderArray - Array of {id, displayOrder}
 * @returns {Promise<void>}
 */
const reorderFeaturedCategories = async (orderArray) => {
  const updatePromises = orderArray.map((item) =>
    FeaturedCategory.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
  );
  await Promise.all(updatePromises);
};

module.exports = {
  createFeaturedCategory,
  queryFeaturedCategories,
  getAllFeaturedCategories,
  getFeaturedCategoryById,
  getNotFeaturedCategories,
  updateFeaturedCategory,
  deleteFeaturedCategory,
  reorderFeaturedCategories,
};
