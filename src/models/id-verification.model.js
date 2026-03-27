const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const idVerificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    idType: {
      type: String,
      required: true,
      enum: ['passport', 'driverLicense', 'nationalId', 'other'],
    },
    idFront: {
      type: String,
      required: true,
    },
    idBack: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
idVerificationSchema.plugin(toJSON);
idVerificationSchema.plugin(paginate);

/**
 * @typedef IdVerification
 */
const IdVerification = mongoose.model('IdVerification', idVerificationSchema);

module.exports = IdVerification;
