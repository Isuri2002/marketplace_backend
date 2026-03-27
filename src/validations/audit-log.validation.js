const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAuditLog = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    action: Joi.string()
      .required()
      .valid(
        'create',
        'update',
        'delete',
        'status_change',
        'login',
        'logout',
        'permission_change',
        'role_change'
      ),
    resourceType: Joi.string()
      .required()
      .valid(
        'user',
        'ad',
        'category',
        'feature',
        'addon',
        'review',
        'navigation',
        'featured_category',
        'id_verification',
        'dynamic_field',
        'garage',
        'promotion',
        'permission',
        'auth'
      ),
    resourceId: Joi.string().custom(objectId),
    description: Joi.string().required(),
    changes: Joi.object(),
  }),
};

const getAuditLogs = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    action: Joi.string(),
    resourceType: Joi.string(),
    resourceId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAuditLog = {
  params: Joi.object().keys({
    auditLogId: Joi.string().custom(objectId),
  }),
};

const getUserAuditLogs = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getResourceAuditLogs = {
  params: Joi.object().keys({
    resourceType: Joi.string().required(),
    resourceId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLog,
  getUserAuditLogs,
  getResourceAuditLogs,
};
