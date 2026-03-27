const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getRolePermissions = {
  params: Joi.object().keys({
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUserPermissions = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const updateUserRole = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const checkPermission = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    permission: Joi.string().required(),
  }),
};

const getUsersByRole = {
  params: Joi.object().keys({
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

module.exports = {
  getRolePermissions,
  getUserPermissions,
  updateUserRole,
  checkPermission,
  getUsersByRole,
};
