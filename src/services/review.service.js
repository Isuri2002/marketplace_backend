const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Ad, Review, Booking } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a review
 * @param {ObjectId} userId
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (userId, reviewBody) => {
  const ad = await Ad.findOne({ _id: reviewBody.adId, status: 'active' });
  if (!ad) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Ad not found');
  }

  // Airbnb-style: only allow reviews from users who have a confirmed booking for this ad
  const confirmedBooking = await Booking.findOne({
    adId: reviewBody.adId,
    renterId: userId,
    status: 'confirmed',
  });
  if (!confirmedBooking) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only review items you have booked and confirmed');
  }

  // Prevent duplicate reviews (fixed field names to match schema)
  const existing = await Review.findOne({ userId, adId: reviewBody.adId });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already reviewed this item');
  }

  reviewBody.userId = userId;
  return Review.create(reviewBody);
};

/**
 * Query reviews for ad
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy]
 * @param {number} [options.limit]
 * @param {number} [options.page]
 * @returns {Promise<QueryResult>}
 */
const queryReviewsForAd = async (filter, options) => {
  filter.status = 'approved';
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Query reviews
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy]
 * @param {number} [options.limit]
 * @param {number} [options.page]
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  options.populate = options.populate ? `${options.populate},adId` : 'adId';
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

const editReview = async (reviewBody) => {
  const review = await Review.findOne({ _id: reviewBody.adId });
  if (!review) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Review not found');
  }
  review.comment = reviewBody.comment;
  review.status = reviewBody.status;
  return review.save();
};

/**
 * Query approved reviews for all ads in a given section
 * @param {string} section - e.g. 'rent', 'hire', 'buy'
 * @param {Object} options - pagination options
 * @returns {Promise<QueryResult>}
 */
const getReviewsBySection = async (section, options) => {
  const ads = await Ad.find({ section, status: 'active' }).select('_id');
  const adIds = ads.map((ad) => ad._id);
  options.populate = 'userId';
  const reviews = await Review.paginate({ adId: { $in: adIds }, status: 'approved' }, options);
  return reviews;
};

module.exports = {
  createReview,
  queryReviewsForAd,
  queryReviews,
  editReview,
  getReviewsBySection,
};
