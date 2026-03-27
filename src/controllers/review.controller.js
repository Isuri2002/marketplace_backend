const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(review);
});

const getReviewsForAd = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['adId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.queryReviewsForAd(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['adId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.queryReviews(filter, options);
  res.status(httpStatus.OK).send(result);
});

const editReview = catchAsync(async (req, res) => {
  const review = await reviewService.editReview(req.body);
  res.status(httpStatus.OK).send(review);
});

const getSectionReviews = catchAsync(async (req, res) => {
  const { section } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.getReviewsBySection(section, options);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createReview,
  getReviewsForAd,
  getReviews,
  editReview,
  getSectionReviews,
};
