const Joi = require('joi');
const { objectId } = require('./custom.validation');

const validateIcon = (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, `"${'mainImg'}" is required`);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const createFeature = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const editFeature = {
  body: Joi.object()
    .keys({
      featureId: Joi.string().custom(objectId),
      name: Joi.string().required(),
      description: Joi.string().required(),
      status: Joi.string().required().valid('active', 'inactive'),
    })
    .unknown(),
};

const deleteFeature = {
  params: Joi.object().keys({
    featureId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  validateIcon,
  createFeature,
  editFeature,
  deleteFeature,
};
