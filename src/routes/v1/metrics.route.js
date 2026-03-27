const express = require('express');
const auth = require('../../middlewares/auth');
const metricsController = require('../../controllers/metrics.controller');

const router = express.Router();

router.route('/dashboard').get(auth('getDashboardMetrics'), metricsController.getDashboardMetrics);

router.route('/active-listings').get(auth('getDashboardMetrics'), metricsController.getActiveListings);

router.route('/revenue').get(auth('getDashboardMetrics'), metricsController.getGeneratedRevenue);

router.route('/customers').get(auth('getDashboardMetrics'), metricsController.getCustomers);

router.route('/recent-listings').get(auth('getDashboardMetrics'), metricsController.getRecentListings);

router.route('/featured-listings').get(auth('getDashboardMetrics'), metricsController.getFeaturedListings);

router.route('/revenue-stream').get(auth('getDashboardMetrics'), metricsController.getRevenueStream);

router.route('/support-tickets').get(auth('getDashboardMetrics'), metricsController.getSupportTickets);

module.exports = router;
