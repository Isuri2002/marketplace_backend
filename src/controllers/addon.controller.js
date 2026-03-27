const httpStatus = require('http-status');
const { addonService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createAddon = catchAsync(async (req, res) => {
  const addon = await addonService.createAddon(req.body);
  res.status(httpStatus.CREATED).send(addon);
});

const getAddons = catchAsync(async (req, res) => {
  const addons = await addonService.getAddons();
  res.status(httpStatus.OK).send(addons);
});

const editAddon = catchAsync(async (req, res) => {
  const addon = await addonService.editAddon(req.body);
  res.status(httpStatus.OK).send(addon);
});

module.exports = {
  createAddon,
  getAddons,
  editAddon,
};
