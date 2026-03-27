const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const auditLogSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'create',
        'update',
        'delete',
        'status_change',
        'login',
        'logout',
        'permission_change',
        'role_change',
      ],
    },
    resourceType: {
      type: String,
      required: true,
      enum: [
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
        'auth',
      ],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
auditLogSchema.plugin(toJSON);
auditLogSchema.plugin(paginate);

/**
 * @typedef AuditLog
 */
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
