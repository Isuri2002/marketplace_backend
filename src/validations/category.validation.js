const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const validateSubCategories = (req, res, next) => {
  // Parse sections if it's a string (multipart/form-data sends arrays as JSON strings)
  if (req.body.sections && typeof req.body.sections === 'string') {
    try {
      req.body.sections = JSON.parse(req.body.sections);
    } catch (error) {
      // Fallback: allow comma-separated list
      req.body.sections = req.body.sections
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  // Normalize sections to an array and remove duplicates
  if (req.body.sections) {
    if (!Array.isArray(req.body.sections)) {
      req.body.sections = [req.body.sections];
    }
    req.body.sections = Array.from(new Set(req.body.sections));
  }

  // Parse subCategories if it's a string
  if (req.body.subCategories && typeof req.body.subCategories === 'string') {
    try {
      req.body.subCategories = JSON.parse(req.body.subCategories);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, `"${'subCategories'}" are not valid`);
    }
  }
  // Check for duplicates in subCategories
  if (req.body.subCategories) {
    const { subCategories } = req.body;
    const names = subCategories.map((subCategory) => subCategory.name);
    const uniqueNames = new Set(names);

    if (names.length !== uniqueNames.size) {
      throw new ApiError(httpStatus.BAD_REQUEST, `"${'subCategories'}" duplicated sub category names are not allowed`);
    }
  }
  next();
};

const validateFiles = (req, res, next) => {
  // Check if icon is provided
  if (!req.files.icon || req.files.icon.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `"${'icon'}" is required`);
  }
  // Check if subCategoryIcons is provided
  if (req.body.subCategories.length > 0 && req.body.subCategories.length !== req.files.subCategoryIcons.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, `"${'subCategoryIcons'}" must be provided for each subCategory`);
  }
  next();
};

const subCategory = Joi.object()
  .keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    subCategories: Joi.array().items(Joi.link('#subCategory')),
  })
  .id('subCategory');

const categoryData = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      // REQUIRED: category must belong to at least one site section
      sections: Joi.array()
        .items(Joi.string().valid('rent', 'hire', 'buy'))
        .min(1)
        .required(),
      subCategories: Joi.array().items(subCategory),
    })
    .unknown(),
};

const categoryId = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

module.exports = {
  validateSubCategories,
  validateFiles,
  categoryData,
  categoryId,
};
