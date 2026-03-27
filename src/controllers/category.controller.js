const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const addNewCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req);
  res.status(httpStatus.CREATED).send({ category });
});

const getCategories = catchAsync(async (req, res) => {
  const { categoryId, section } = req.query;
  const categories = await categoryService.findCategories(categoryId, section);
  res.send({ categories });
});

const editCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryService.updateCategory(categoryId, req);
  res.send({ category });
});

const removeCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  await categoryService.deleteCategory(categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addNewCategory,
  getCategories,
  editCategory,
  removeCategory,
};
