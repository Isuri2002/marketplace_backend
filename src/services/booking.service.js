const httpStatus = require('http-status');
const { Booking, Ad } = require('../models');
const ApiError = require('../utils/ApiError');

const normalizeDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date');
  }
  return date;
};

const calculateUnits = (startDate, endDate, rentFrequency) => {
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'End date must be after start date');
  }

  let unitMs = 1000 * 60 * 60 * 24; // daily default
  if (rentFrequency === 'hourly') unitMs = 1000 * 60 * 60;
  if (rentFrequency === 'weekly') unitMs = 1000 * 60 * 60 * 24 * 7;
  if (rentFrequency === 'monthly') unitMs = 1000 * 60 * 60 * 24 * 30;

  return Math.max(1, Math.ceil(diffMs / unitMs));
};

/**
 * Create booking
 * @param {ObjectId} userId
 * @param {Object} bookingBody
 * @returns {Promise<Booking>}
 */
const createBooking = async (userId, bookingBody) => {
  const ad = await Ad.findOne({ _id: bookingBody.adId, status: 'active' });
  if (!ad) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Ad not found');
  }
  if (ad.userId && ad.userId.toString() === userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot book your own ad');
  }

  const startDate = normalizeDate(bookingBody.startDate);
  const endDate = normalizeDate(bookingBody.endDate);

  const overlap = await Booking.findOne({
    adId: ad._id,
    status: { $in: ['pending', 'confirmed'] },
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
  });
  if (overlap) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Selected dates are unavailable');
  }

  const unitCount = calculateUnits(startDate, endDate, ad.rentFrequency);
  const price = Number(ad.price || 0);
  const totalAmount = unitCount * price;

  return Booking.create({
    adId: ad._id,
    renterId: userId,
    ownerId: ad.userId,
    startDate,
    endDate,
    priceSnapshot: price,
    rentFrequencySnapshot: ad.rentFrequency || 'daily',
    currencySnapshot: bookingBody.currency || 'AUD',
    totalAmount,
    contactName: bookingBody.fullName,
    contactEmail: bookingBody.email,
    contactPhone: bookingBody.phone,
  });
};

/**
 * Get booking by id
 * @param {ObjectId} bookingId
 * @param {ObjectId} userId
 * @returns {Promise<Booking>}
 */
const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId).populate('adId', 'title price rentFrequency');
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  const isOwner = booking.ownerId.toString() === userId;
  const isRenter = booking.renterId.toString() === userId;
  if (!isOwner && !isRenter) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return booking;
};

/**
 * Check if a user has a confirmed booking for an ad (used for review eligibility)
 * @param {ObjectId} userId
 * @param {ObjectId} adId
 * @returns {Promise<{eligible: boolean, alreadyReviewed: boolean}>}
 */
const checkReviewEligibility = async (userId, adId) => {
  const { Review } = require('../models');
  const confirmedBooking = await Booking.findOne({
    adId,
    renterId: userId,
    status: 'confirmed',
  });
  if (!confirmedBooking) {
    return { eligible: false, alreadyReviewed: false };
  }
  const existing = await Review.findOne({ userId, adId });
  return { eligible: true, alreadyReviewed: !!existing };
};

module.exports = {
  createBooking,
  getBookingById,
  checkReviewEligibility,
};
