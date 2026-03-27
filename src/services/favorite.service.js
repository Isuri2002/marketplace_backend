const httpStatus = require('http-status');
const { Favorite, Ad } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Add ad to favorites
 * @param {ObjectId} userId
 * @param {ObjectId} adId
 * @returns {Promise<Favorite>}
 */
const addFavorite = async (userId, adId) => {
  // Check if ad exists and is active
  const ad = await Ad.findOne({ _id: adId, status: 'active' });
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found or not active');
  }

  // Check if already favorited
  const existingFavorite = await Favorite.findOne({ userId, adId });
  if (existingFavorite) {
    // Return existing favorite (idempotent)
    return { favorite: existingFavorite, created: false };
  }

  // Create favorite
  const favorite = await Favorite.create({ userId, adId });
  return { favorite, created: true };
};

/**
 * Remove ad from favorites
 * @param {ObjectId} userId
 * @param {ObjectId} adId
 * @returns {Promise<Favorite>}
 */
const removeFavorite = async (userId, adId) => {
  const favorite = await Favorite.findOne({ userId, adId });
  if (!favorite) {
    // Idempotent: nothing to remove
    return null;
  }

  await favorite.deleteOne();
  return favorite;
};

/**
 * Get user's favorite ads with full ad details
 * @param {ObjectId} userId
 * @param {Object} options - Query options
 * @returns {Promise<Favorite[]>}
 */
const getUserFavorites = async (userId, options = {}) => {
  const { sortBy = '-createdAt', limit = 50, page = 1 } = options;

  const skip = (page - 1) * limit;

  const favorites = await Favorite.find({ userId })
    .populate({
      path: 'adId',
      match: { status: 'active' }, // Only populate active ads
      select: 'title description mainImage price rentFrequency priceType addressLine1 city category subCategory',
      populate: { path: 'category', select: 'name subCategories' },
    })
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit));

  // Filter out favorites where ad was deleted or inactive
  const validFavorites = favorites.filter((fav) => fav.adId !== null);

  // Clean up orphaned favorites (where ad is deleted)
  const orphanedIds = favorites.filter((fav) => fav.adId === null).map((fav) => fav._id);
  if (orphanedIds.length > 0) {
    await Favorite.deleteMany({ _id: { $in: orphanedIds } });
  }

  return validFavorites;
};

/**
 * Check if ad is favorited by user
 * @param {ObjectId} userId
 * @param {ObjectId} adId
 * @returns {Promise<boolean>}
 */
const isFavorite = async (userId, adId) => {
  const favorite = await Favorite.findOne({ userId, adId });
  return !!favorite;
};

/**
 * Get count of users who favorited an ad
 * @param {ObjectId} adId
 * @returns {Promise<number>}
 */
const getFavoriteCount = async (adId) => {
  const count = await Favorite.countDocuments({ adId });
  return count;
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isFavorite,
  getFavoriteCount,
};
