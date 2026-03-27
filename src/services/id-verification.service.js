const httpStatus = require('http-status');
const { IdVerification, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create ID verification request
 * @param {ObjectId} userId
 * @param {Object} verificationData
 * @returns {Promise<IdVerification>}
 */
const createVerificationRequest = async (userId, verificationData) => {
  // Check if user already has a pending or verified request
  const existingRequest = await IdVerification.findOne({
    user: userId,
    status: { $in: ['pending', 'verified'] },
  });

  if (existingRequest) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You already have a pending or verified ID verification request');
  }

  const verification = await IdVerification.create({
    user: userId,
    ...verificationData,
  });

  return verification;
};

/**
 * Query ID verification requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVerificationRequests = async (filter, options) => {
  const verifications = await IdVerification.paginate(filter, {
    ...options,
    populate: 'user',
  });
  return verifications;
};

/**
 * Get verification request by id
 * @param {ObjectId} id
 * @returns {Promise<IdVerification>}
 */
const getVerificationRequestById = async (id) => {
  const verification = await IdVerification.findById(id).populate('user');
  if (!verification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Verification request not found');
  }
  return verification;
};

/**
 * Update verification request status
 * @param {ObjectId} verificationId
 * @param {ObjectId} adminId
 * @param {string} status
 * @param {string} rejectionReason
 * @returns {Promise<IdVerification>}
 */
const updateVerificationStatus = async (verificationId, adminId, status, rejectionReason) => {
  const verification = await getVerificationRequestById(verificationId);

  verification.status = status;
  verification.reviewedBy = adminId;
  verification.reviewedAt = new Date();

  if (status === 'rejected' && rejectionReason) {
    verification.rejectionReason = rejectionReason;
  }

  await verification.save();

  // Update user's isIdVerified status
  if (status === 'verified') {
    await User.findByIdAndUpdate(verification.user, { isIdVerified: true });
  } else if (status === 'rejected') {
    await User.findByIdAndUpdate(verification.user, { isIdVerified: false });
  }

  return verification;
};

/**
 * Get user's verification request
 * @param {ObjectId} userId
 * @returns {Promise<IdVerification>}
 */
const getUserVerificationRequest = async (userId) => {
  const verification = await IdVerification.findOne({ user: userId }).sort({ createdAt: -1 });
  return verification;
};

/**
 * Delete verification request
 * @param {ObjectId} verificationId
 * @returns {Promise<IdVerification>}
 */
const deleteVerificationRequest = async (verificationId) => {
  const verification = await getVerificationRequestById(verificationId);
  await verification.remove();
  return verification;
};

module.exports = {
  createVerificationRequest,
  queryVerificationRequests,
  getVerificationRequestById,
  updateVerificationStatus,
  getUserVerificationRequest,
  deleteVerificationRequest,
};
