const httpStatus = require('http-status');
const { AuditLog } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an audit log entry
 * @param {Object} logData
 * @param {ObjectId} logData.userId - User who performed the action
 * @param {string} logData.action - Action performed
 * @param {string} logData.resourceType - Type of resource
 * @param {ObjectId} [logData.resourceId] - ID of the affected resource
 * @param {string} logData.description - Description of the action
 * @param {Object} [logData.changes] - Changes made
 * @param {string} [logData.ipAddress] - IP address
 * @param {string} [logData.userAgent] - User agent
 * @returns {Promise<AuditLog>}
 */
const createAuditLog = async (logData) => {
  return AuditLog.create(logData);
};

/**
 * Query for audit logs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} [options.populate] - Populate data fields. Example: 'userId'
 * @returns {Promise<QueryResult>}
 */
const queryAuditLogs = async (filter, options) => {
  options.populate = 'userId';
  options.sortBy = 'createdAt:desc';
  const logs = await AuditLog.paginate(filter, options);
  return logs;
};

/**
 * Get audit log by id
 * @param {ObjectId} id
 * @returns {Promise<AuditLog>}
 */
const getAuditLogById = async (id) => {
  return AuditLog.findById(id).populate('userId');
};

/**
 * Get audit logs by user id
 * @param {ObjectId} userId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getAuditLogsByUserId = async (userId, options) => {
  return queryAuditLogs({ userId }, options);
};

/**
 * Get audit logs by resource
 * @param {string} resourceType
 * @param {ObjectId} resourceId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getAuditLogsByResource = async (resourceType, resourceId, options) => {
  return queryAuditLogs({ resourceType, resourceId }, options);
};

/**
 * Delete audit logs older than specified days
 * @param {number} days
 * @returns {Promise}
 */
const deleteOldAuditLogs = async (days) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return AuditLog.deleteMany({ createdAt: { $lt: cutoffDate } });
};

module.exports = {
  createAuditLog,
  queryAuditLogs,
  getAuditLogById,
  getAuditLogsByUserId,
  getAuditLogsByResource,
  deleteOldAuditLogs,
};
