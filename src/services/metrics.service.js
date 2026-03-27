const { Ad, User, Review, FeaturedCategory } = require('../models');

/**
 * Get active listings count and recent listings
 * @returns {Promise<Object>}
 */
const getActiveListings = async () => {
  const activeCount = await Ad.countDocuments({ status: 'active' });
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const newCount = await Ad.countDocuments({
    status: 'active',
    createdDate: { $gte: lastMonth },
  });

  return {
    title: 'Active Listings',
    active: activeCount,
    new: `${newCount} new`,
    duration: 'since last month',
  };
};

/**
 * Get generated revenue (from addons and promotions)
 * @returns {Promise<Object>}
 */
const getGeneratedRevenue = async () => {
  const ads = await Ad.find({ status: { $in: ['active', 'inactive', 'expired'] } }).select(
    'totalAddonCharge'
  );
  const totalRevenue = ads.reduce((sum, ad) => sum + (ad.totalAddonCharge || 0), 0);

  return {
    title: 'Generated Revenue',
    amount: `$${totalRevenue.toFixed(2)}`,
    change: '+12%',
    duration: 'since last month',
  };
};

/**
 * Get customer statistics
 * @returns {Promise<Object>}
 */
const getCustomers = async () => {
  const totalCustomers = await User.countDocuments({ role: 'user' });
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const newCustomers = await User.countDocuments({
    role: 'user',
    createdAt: { $gte: lastMonth },
  });

  return {
    title: 'Total Customers',
    total: totalCustomers,
    new: `${newCustomers} new`,
    duration: 'since last month',
  };
};

/**
 * Get recent listings for dashboard
 * @param {number} limit - Number of listings to return
 * @returns {Promise<Array>}
 */
const getRecentListings = async (limit = 5) => {
  const listings = await Ad.find()
    .sort({ createdDate: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email')
    .populate('category', 'name');

  return listings.map((listing) => ({
    id: listing._id,
    title: listing.title,
    price: listing.price,
    status: listing.status,
    category: listing.category?.name,
    user: listing.userId
      ? `${listing.userId.firstName} ${listing.userId.lastName}`
      : 'Unknown',
    createdDate: listing.createdDate,
  }));
};

/**
 * Get featured listings
 * @param {number} limit - Number of listings to return
 * @returns {Promise<Array>}
 */
const getFeaturedListings = async (limit = 5) => {
  const featured = await FeaturedCategory.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('categoryId', 'name');

  return featured.map((item) => ({
    id: item._id,
    categoryName: item.categoryId?.name,
    title: item.title,
    description: item.description,
    createdAt: item.createdAt,
  }));
};

/**
 * Get revenue stream data for charts
 * @returns {Promise<Object>}
 */
const getRevenueStream = async () => {
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get ads with addons by month
  const ads = await Ad.aggregate([
    {
      $match: {
        createdDate: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdDate' },
        totalAddonCharge: { $sum: '$totalAddonCharge' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Initialize data arrays
  const commissions = new Array(12).fill(0);
  const addons = new Array(12).fill(0);
  const services = new Array(12).fill(0);

  // Fill in the data
  ads.forEach((item) => {
    const monthIndex = item._id - 1;
    addons[monthIndex] = item.totalAddonCharge || 0;
    // Mock commission and services data (15% commission)
    commissions[monthIndex] = (item.totalAddonCharge || 0) * 0.15;
    services[monthIndex] = (item.totalAddonCharge || 0) * 0.1;
  });

  return {
    labels: months,
    datasets: {
      commissions,
      addons,
      services,
    },
  };
};

/**
 * Get support tickets count (placeholder for future implementation)
 * @returns {Promise<Object>}
 */
const getSupportTickets = async () => {
  // Placeholder for future support ticket system
  return {
    title: 'Support Tickets',
    open: 0,
    closed: 0,
    pending: 0,
  };
};

/**
 * Get comprehensive dashboard metrics
 * @returns {Promise<Object>}
 */
const getDashboardMetrics = async () => {
  const [activeListings, revenue, customers, recentListings, featuredListings, revenueStream] = await Promise.all([
    getActiveListings(),
    getGeneratedRevenue(),
    getCustomers(),
    getRecentListings(),
    getFeaturedListings(),
    getRevenueStream(),
  ]);

  return {
    activeListings,
    revenue,
    customers,
    recentListings,
    featuredListings,
    revenueStream,
  };
};

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
