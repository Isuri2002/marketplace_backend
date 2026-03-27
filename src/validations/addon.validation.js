const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAddOn = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const editAddOn = {
  body: Joi.object().keys({
    addOnId: Joi.string().required().custom(objectId),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.string().valid('active', 'inactive'),
  }),
};

const addOnId = {
  params: Joi.object().keys({
    addOnId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createAddOn,
  editAddOn,
  addOnId,
};
