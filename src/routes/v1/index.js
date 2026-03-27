const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const categoryDynamicFieldRoute = require('./dynamic-field.route');
const adRoute = require('./ad.route');
const docsRoute = require('./docs.route');
const reviewRoute = require('./review.route');
const featureRoute = require('./feature.route');
const addonRoute = require('./addon.route');
const idVerificationRoute = require('./id-verification.route');
const featuredCategoryRoute = require('./featured-category.route');
const navigationRoute = require('./navigation.route');
const auditLogRoute = require('./audit-log.route');
const metricsRoute = require('./metrics.route');
const permissionRoute = require('./permission.route');
const favoriteRoute = require('./favorite.route');
const bookingRoute = require('./booking.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/dynamic-fields',
    route: categoryDynamicFieldRoute,
  },
  {
    path: '/ads',
    route: adRoute,
  },
  {
    path: '/locations',
    route: require('./location.route'),
  },
  {
    path: '/favorites',
    route: favoriteRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/features',
    route: featureRoute,
  },
  {
    path: '/addons',
    route: addonRoute,
  },
  {
    path: '/id-verification',
    route: idVerificationRoute,
  },
  {
    path: '/featured-categories',
    route: featuredCategoryRoute,
  },
  {
    path: '/navigations',
    route: navigationRoute,
  },
  {
    path: '/audit-logs',
    route: auditLogRoute,
  },
  {
    path: '/metrics',
    route: metricsRoute,
  },
  {
    path: '/permissions',
    route: permissionRoute,
  },
  {
    path: '/bookings',
    route: bookingRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
