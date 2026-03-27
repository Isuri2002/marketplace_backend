const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBooking = {
  body: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    fullName: Joi.string().trim().min(2).required(),
    email: Joi.string().trim().email().required(),
    phone: Joi.string().trim().allow('', null),
    currency: Joi.string().trim().optional(),
  }),
};

const bookingId = {
  params: Joi.object().keys({
    bookingId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createBooking,
  bookingId,
};
