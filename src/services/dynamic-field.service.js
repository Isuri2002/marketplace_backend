const httpStatus = require('http-status');
const { Category, CategoryDynamicField } = require('../models');
const ApiError = require('../utils/ApiError');
const { validateCategoryOrSubCategory } = require('../utils/categoryValidate');

/**
 * Create a category dynamic field
 * @param {Object} dynamicFields
 * @returns {Promise<CategoryFields>}
 */
const createCategoryDynamicFields = async (dynamicFields) => {
  await validateCategoryOrSubCategory(dynamicFields.categoryId); // check category ID is exist
  const categoryFields = dynamicFields.fields.map((field) => ({
    categoryId: dynamicFields.categoryId,
    ...field,
  }));
  return CategoryDynamicField.insertMany(categoryFields);
};

/**
 * Get category dynamic fields
 * @param {String|Array} categoryIds
 * @returns {Promise<DynamicFields>}
 */
const getCategoryDynamicFields = async (categoryIds) => {
  // Handle single categoryId or array of categoryIds
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
  const dynamicFields = await CategoryDynamicField.find({
    categoryId: { $in: ids },
  });
  return dynamicFields;
};

/**
 * Edit a category dynamic field
 * @param {Object} updateData
 * @returns {Promise<DynamicFields>}
 */
const editCategoryDynamicFields = async (updateData) => {
  const categoryDynamicField = await CategoryDynamicField.findOne({ _id: updateData.body.dynamicFieldId });
  if (!categoryDynamicField) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dynamic field not found');
  }
  Object.assign(categoryDynamicField, updateData.body);
  await categoryDynamicField.save();
  return categoryDynamicField;
};

/**
 * Delete a category dynamic field
 * @param {ObjectId} dynamicFieldId
 * @returns {Promise<DynamicFields>}
 */
const deleteCategoryDynamicFields = async (dynamicFieldId) => {
  const categoryDynamicField = await CategoryDynamicField.findOne({ _id: dynamicFieldId });
  if (!categoryDynamicField) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dynamic field not found');
  }
  await categoryDynamicField.remove();
  return categoryDynamicField;
};

module.exports = {
  createCategoryDynamicFields,
  getCategoryDynamicFields,
  editCategoryDynamicFields,
  deleteCategoryDynamicFields,
};
