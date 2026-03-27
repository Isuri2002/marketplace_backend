const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { navigationService } = require('../services');

const createNavigation = catchAsync(async (req, res) => {
  const navigation = await navigationService.createNavigation(req.body.categoryId, req.body.section);
  res.status(httpStatus.CREATED).send(navigation);
});

const getNavigations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await navigationService.queryNavigations(filter, options);
  res.send(result);
});

const getAllNavigations = catchAsync(async (req, res) => {
  const result = await navigationService.getAllNavigations();
  res.send(result);
});

const getNavigation = catchAsync(async (req, res) => {
  const navigation = await navigationService.getNavigationById(req.params.navigationId);
  res.send(navigation);
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await navigationService.getAllCategories();
  res.send(categories);
});

const getAllCategoriesWithNavStatus = catchAsync(async (req, res) => {
  const categories = await navigationService.getAllCategoriesWithNavStatus();
  res.send({ categories });
});

const updateNavigation = catchAsync(async (req, res) => {
  const navigation = await navigationService.updateNavigation(req.params.navigationId, req.body);
  res.send(navigation);
});

const deleteNavigation = catchAsync(async (req, res) => {
  await navigationService.deleteNavigation(req.params.navigationId);
  res.status(httpStatus.NO_CONTENT).send();
});

const reorderNavigations = catchAsync(async (req, res) => {
  await navigationService.reorderNavigations(req.body.orderArray);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNavigation,
  getNavigations,
  getAllNavigations,
  getNavigation,
  getAllCategories,
  getAllCategoriesWithNavStatus,
  updateNavigation,
  deleteNavigation,
  reorderNavigations,
};
