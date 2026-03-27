const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const { Feature } = require('../models');
const ApiError = require('../utils/ApiError');
const { sanitizeFilename } = require('../utils/filenameSanitize');

/**
 * Create a feature
 * @param {Object} featureData
 * @returns {Promise<Feature>}
 */
const createFeature = async (featureData) => {
  try {
    const isFeatureExist = await Feature.findOne({ name: featureData.body.name });
    if (isFeatureExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Feature already exist');
    }
    featureData.body.iconStr = sanitizeFilename(featureData.file.filename);
    const feature = await Feature.create(featureData.body);
    return feature;
  } catch (error) {
    fs.unlink(iconFilePath(featureData.file.filename), (err) => {
      if (err) throw err;
    });
    throw error;
  }
};

/**
 * Query for features
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy]
 * @param {number} [options.limit]
 * @param {number} [options.page]
 */
const getFeatures = async (filter, options) => {
  const features = await Feature.paginate(filter, options);
  return features;
};

/**
 * Edit a feature
 * @param {Object} updateData
 * @returns {Promise<Feature>}
 */
const editFeature = async (updateData) => {
  try {
    const feature = await Feature.findOne({ _id: updateData.body.featureId });
    if (!feature) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Feature not found');
    }
    if (updateData.file) {
      fs.unlink(iconFilePath(feature.iconStr), (err) => {
        if (err) throw err;
      });
      updateData.body.iconStr = sanitizeFilename(updateData.file.filename);
    } else {
      updateData.body.iconStr = feature.iconStr;
    }
    Object.assign(feature, updateData.body);
    await feature.save();
    return feature;
  } catch (error) {
    if (updateData.file) {
      fs.unlink(iconFilePath(updateData.file.filename), (err) => {
        if (err) throw err;
      });
    }
    throw error;
  }
};

/**
 * Delete a feature
 * @param {ObjectId} featureId
 * @returns {Promise<Feature>}
 */
const deleteFeature = async (featureId) => {
  const feature = await Feature.findOne({ _id: featureId });
  if (!feature) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feature not found');
  }
  fs.unlink(iconFilePath(feature.iconStr), (err) => {
    if (err) throw err;
  });
  await feature.remove();
  return feature;
};

/**
 * Get file path
 * @param {string} filename
 * @returns {string}
 */
const iconFilePath = (filename) => {
  return path.join('public/uploads/feature_icons', filename);
};

module.exports = {
  createFeature,
  getFeatures,
  editFeature,
  deleteFeature,
};
