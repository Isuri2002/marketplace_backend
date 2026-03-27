const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { idVerificationService } = require('../services');

const createVerificationRequest = catchAsync(async (req, res) => {
  const verification = await idVerificationService.createVerificationRequest(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(verification);
});

const getVerificationRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Default sort by newest first
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  const result = await idVerificationService.queryVerificationRequests(filter, options);
  res.send(result);
});

const getVerificationRequest = catchAsync(async (req, res) => {
  const verification = await idVerificationService.getVerificationRequestById(req.params.verificationId);
  res.send(verification);
});

const updateVerificationStatus = catchAsync(async (req, res) => {
  const { idVerifyId, status, rejectionReason } = req.body;
  const verification = await idVerificationService.updateVerificationStatus(
    idVerifyId,
    req.user.id,
    status,
    rejectionReason
  );
  res.send(verification);
});

const getUserVerification = catchAsync(async (req, res) => {
  const verification = await idVerificationService.getUserVerificationRequest(req.user.id);
  res.send(verification);
});

const deleteVerificationRequest = catchAsync(async (req, res) => {
  await idVerificationService.deleteVerificationRequest(req.params.verificationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createVerificationRequest,
  getVerificationRequests,
  getVerificationRequest,
  updateVerificationStatus,
  getUserVerification,
  deleteVerificationRequest,
};
