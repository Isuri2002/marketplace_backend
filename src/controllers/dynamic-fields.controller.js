const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryDynamicFieldService } = require('../services');

const createDynamicFields = catchAsync(async (req, res) => {
  const dynamicFields = await categoryDynamicFieldService.createCategoryDynamicFields(req.body);
  res.status(httpStatus.CREATED).send({ dynamicFields });
});

const getDynamicFields = catchAsync(async (req, res) => {
  const dynamicFields = await categoryDynamicFieldService.getCategoryDynamicFields(req.query.categoryIds);
  res.status(httpStatus.OK).send({ dynamicFields });
});

const editDynamicFields = catchAsync(async (req, res) => {
  const dynamicFields = await categoryDynamicFieldService.editCategoryDynamicFields(req.body);
  res.status(httpStatus.OK).send({ dynamicFields });
});

const deleteDynamicFields = catchAsync(async (req, res) => {
  const dynamicFields = await categoryDynamicFieldService.deleteCategoryDynamicFields(req.params.dynamicFieldId);
  res.status(httpStatus.OK).send({ dynamicFields });
});

module.exports = {
  createDynamicFields,
  getDynamicFields,
  editDynamicFields,
  deleteDynamicFields,
};
