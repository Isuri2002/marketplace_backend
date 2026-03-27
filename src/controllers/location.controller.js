const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Ad } = require('../models');

const getLocations = catchAsync(async (req, res) => {
  // Basic filter: only active ads with coordinates
  const filter = { status: 'active', latitude: { $exists: true }, longitude: { $exists: true } };

  // Optionally filter by category or subCategory if provided
  if (req.query.category) filter.category = req.query.category;
  if (req.query.subCategory) filter.subCategory = req.query.subCategory;

  const projection = '_id title latitude longitude addressLine1 addressLine2 city zipCode mainImage';
  const ads = await Ad.find(filter).select(projection).lean();

  res.status(httpStatus.OK).send({ count: ads.length, locations: ads });
});

module.exports = {
  getLocations,
};
