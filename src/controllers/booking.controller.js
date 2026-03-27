const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { bookingService } = require('../services');

const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(booking);
});

const getBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.bookingId, req.user.id);
  res.status(httpStatus.OK).send(booking);
});

// Check if the logged-in user can review a specific ad (has confirmed booking, hasn't reviewed yet)
const checkReviewEligibility = catchAsync(async (req, res) => {
  const result = await bookingService.checkReviewEligibility(req.user.id, req.params.adId);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createBooking,
  getBooking,
  checkReviewEligibility,
};
