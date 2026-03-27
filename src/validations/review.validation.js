const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().required(),
    status: Joi.forbidden(),
  }),
};

const getReviewsForAd = {
  query: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const editReview = {
  body: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().required(),
    status: Joi.string().valid('approved', 'rejected').required(),
  }),
};

const getSectionReviews = {
  query: Joi.object().keys({
    section: Joi.string().valid('rent', 'hire', 'buy').required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createReview,
  getReviewsForAd,
  getReviews,
  editReview,
  getSectionReviews,
};
