const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { featureService } = require('../services');
const pick = require('../utils/pick');

const addNewFeature = catchAsync(async (req, res) => {
  const feature = await featureService.createFeature(req);
  res.status(httpStatus.CREATED).send({ feature });
});

const getFeatures = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const features = await featureService.getFeatures(filter, options);
  res.status(httpStatus.OK).send(features);
});

const editFeature = catchAsync(async (req, res) => {
  const feature = await featureService.editFeature(req);
  res.status(httpStatus.OK).send({ feature });
});

const deleteFeature = catchAsync(async (req, res) => {
  const feature = await featureService.deleteFeature(req.params.featureId);
  res.status(httpStatus.OK).send({ feature });
});

module.exports = {
  addNewFeature,
  getFeatures,
  editFeature,
  deleteFeature,
};
