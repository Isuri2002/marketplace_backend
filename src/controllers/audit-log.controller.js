const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { auditLogService } = require('../services');

const createAuditLog = catchAsync(async (req, res) => {
  const logData = {
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };
  const auditLog = await auditLogService.createAuditLog(logData);
  res.status(httpStatus.CREATED).send(auditLog);
});

const getAuditLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId', 'action', 'resourceType', 'resourceId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await auditLogService.queryAuditLogs(filter, options);
  res.send(result);
});

const getAuditLog = catchAsync(async (req, res) => {
  const auditLog = await auditLogService.getAuditLogById(req.params.auditLogId);
  if (!auditLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Audit log not found');
  }
  res.send(auditLog);
});

const getUserAuditLogs = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await auditLogService.getAuditLogsByUserId(req.params.userId, options);
  res.send(result);
});

const getResourceAuditLogs = catchAsync(async (req, res) => {
  const { resourceType, resourceId } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await auditLogService.getAuditLogsByResource(resourceType, resourceId, options);
  res.send(result);
});

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLog,
  getUserAuditLogs,
  getResourceAuditLogs,
};
