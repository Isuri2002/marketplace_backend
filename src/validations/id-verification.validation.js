const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createVerificationRequest = {
  body: Joi.object().keys({
    idType: Joi.string().required().valid('passport', 'driverLicense', 'nationalId', 'other'),
    idFront: Joi.string().required(),
    idBack: Joi.string().optional().allow(''),
  }),
};

const getVerificationRequests = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'verified', 'rejected', 'all'),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getVerificationRequest = {
  params: Joi.object().keys({
    verificationId: Joi.string().custom(objectId),
  }),
};

const updateVerificationStatus = {
  body: Joi.object().keys({
    idVerifyId: Joi.string().custom(objectId).required(),
    status: Joi.string().required().valid('verified', 'rejected'),
    rejectionReason: Joi.string().optional(),
  }),
};

const deleteVerificationRequest = {
  params: Joi.object().keys({
    verificationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createVerificationRequest,
  getVerificationRequests,
  getVerificationRequest,
  updateVerificationStatus,
  deleteVerificationRequest,
};
