const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { metricsService } = require('../services');

const getActiveListings = catchAsync(async (req, res) => {
  const result = await metricsService.getActiveListings();
  res.send(result);
});

const getGeneratedRevenue = catchAsync(async (req, res) => {
  const result = await metricsService.getGeneratedRevenue();
  res.send(result);
});

const getCustomers = catchAsync(async (req, res) => {
  const result = await metricsService.getCustomers();
  res.send(result);
});

const getRecentListings = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 5;
  const result = await metricsService.getRecentListings(limit);
  res.send(result);
});

const getFeaturedListings = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 5;
  const result = await metricsService.getFeaturedListings(limit);
  res.send(result);
});

const getRevenueStream = catchAsync(async (req, res) => {
  const result = await metricsService.getRevenueStream();
  res.send(result);
});

const getSupportTickets = catchAsync(async (req, res) => {
  const result = await metricsService.getSupportTickets();
  res.send(result);
});

const getDashboardMetrics = catchAsync(async (req, res) => {
  const result = await metricsService.getDashboardMetrics();
  res.send(result);
});

module.exports = {
  getActiveListings,
  getGeneratedRevenue,
  getCustomers,
  getRecentListings,
  getFeaturedListings,
  getRevenueStream,
  getSupportTickets,
  getDashboardMetrics,
};
