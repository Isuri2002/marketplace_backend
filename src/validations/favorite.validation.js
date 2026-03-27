const Joi = require('joi');
const { objectId } = require('./custom.validation');

const adId = {
  params: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
  }),
};

const getUserFavorites = {
  query: Joi.object()
    .keys({
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .unknown(true), // Allow unknown query parameters
};

module.exports = {
  adId,
  getUserFavorites,
};
