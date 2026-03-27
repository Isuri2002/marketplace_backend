const httpStatus = require('http-status');
const { Addons } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a addon
 * @param {Object} addonBody
 * @returns {Promise<addon>}
 */
const createAddon = async (addonBody) => {
  const addonExist = await Addons.findOne({ name: addonBody.name });
  if (addonExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Addon already exist');
  }
  const addon = await Addons.create(addonBody);
  return addon;
};

/**
 * Get all addons
 * @returns {Promise<addons>}
 */
const getAddons = async () => {
  const addons = await Addons.find({});
  return addons;
};

/**
 * Edit a addon
 * @param {Object} addonBody
 * @returns {Promise<addon>}
 */
const editAddon = async (addonBody) => {
  const addon = await Addons.findOne({ _id: addonBody.addOnId });
  if (!addon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Addon not found');
  }
  Object.assign(addon, addonBody);
  await addon.save();
  return addon;
};

module.exports = {
  createAddon,
  getAddons,
  editAddon,
};
