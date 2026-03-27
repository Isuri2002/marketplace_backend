const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('./ApiError');

const validateCategoryAndSubCategory = async (categoryId, subCategoryId) => {
  const categoryExists = await Category.findOne({
    _id: categoryId,
    'subCategories._id': subCategoryId,
  });

  if (!categoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category or SubCategory does not exist');
  }

  return categoryExists;
};

const validateCategoryOrSubCategory = async (categoryId) => {
  const categoryExists = await Category.findById(categoryId);
  const categoryWithSubCategoryExists = await Category.findOne({
    'subCategories._id': categoryId,
  });
  if (!categoryExists && !categoryWithSubCategoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
  }
};

module.exports = {
  validateCategoryAndSubCategory,
  validateCategoryOrSubCategory,
};
