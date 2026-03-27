const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { featuredCategoryService } = require('../services');

const createFeaturedCategory = catchAsync(async (req, res) => {
  const featuredCategory = await featuredCategoryService.createFeaturedCategory({
    categoryId: req.body.categoryId,
    image: req.file ? req.file.filename : req.body.image,
  });
  res.status(httpStatus.CREATED).send(featuredCategory);
});

const getFeaturedCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await featuredCategoryService.queryFeaturedCategories(filter, options);
  res.send(result);
});

const getAllFeaturedCategories = catchAsync(async (req, res) => {
  const result = await featuredCategoryService.getAllFeaturedCategories();
  res.send(result);
});

const getFeaturedCategory = catchAsync(async (req, res) => {
  const featuredCategory = await featuredCategoryService.getFeaturedCategoryById(req.params.featuredCategoryId);
  res.send(featuredCategory);
});

const getNotFeaturedCategories = catchAsync(async (req, res) => {
  const categories = await featuredCategoryService.getNotFeaturedCategories();
  res.send(categories);
});

const updateFeaturedCategory = catchAsync(async (req, res) => {
  const updateBody = {
    ...req.body,
  };

  if (req.file) {
    updateBody.image = req.file.filename;
  }

  const featuredCategory = await featuredCategoryService.updateFeaturedCategory(req.body.id, updateBody);
  res.send(featuredCategory);
});

const deleteFeaturedCategory = catchAsync(async (req, res) => {
  await featuredCategoryService.deleteFeaturedCategory(req.params.featuredCategoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

const reorderFeaturedCategories = catchAsync(async (req, res) => {
  await featuredCategoryService.reorderFeaturedCategories(req.body.orderArray);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFeaturedCategory,
  getFeaturedCategories,
  getAllFeaturedCategories,
  getFeaturedCategory,
  getNotFeaturedCategories,
  updateFeaturedCategory,
  deleteFeaturedCategory,
  reorderFeaturedCategories,
};
