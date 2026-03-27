const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const auditLogValidation = require('../../validations/audit-log.validation');
const auditLogController = require('../../controllers/audit-log.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageAuditLogs'), validate(auditLogValidation.createAuditLog), auditLogController.createAuditLog)
  .get(auth('getAuditLogs'), validate(auditLogValidation.getAuditLogs), auditLogController.getAuditLogs);

router
  .route('/:auditLogId')
  .get(auth('getAuditLogs'), validate(auditLogValidation.getAuditLog), auditLogController.getAuditLog);

router
  .route('/user/:userId')
  .get(auth('getAuditLogs'), validate(auditLogValidation.getUserAuditLogs), auditLogController.getUserAuditLogs);

router
  .route('/resource/:resourceType/:resourceId')
  .get(auth('getAuditLogs'), validate(auditLogValidation.getResourceAuditLogs), auditLogController.getResourceAuditLogs);

module.exports = router;
