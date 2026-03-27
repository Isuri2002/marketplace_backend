const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const idVerificationValidation = require('../../validations/id-verification.validation');
const idVerificationController = require('../../controllers/id-verification.controller');

const router = express.Router();

// User routes
router
  .route('/user')
  .post(
    auth(),
    validate(idVerificationValidation.createVerificationRequest),
    idVerificationController.createVerificationRequest
  )
  .get(auth(), idVerificationController.getUserVerification);

// Admin routes
router
  .route('/')
  .get(
    auth('manageUsers'),
    validate(idVerificationValidation.getVerificationRequests),
    idVerificationController.getVerificationRequests
  )
  .patch(
    auth('manageUsers'),
    validate(idVerificationValidation.updateVerificationStatus),
    idVerificationController.updateVerificationStatus
  );

router
  .route('/:verificationId')
  .get(
    auth('manageUsers'),
    validate(idVerificationValidation.getVerificationRequest),
    idVerificationController.getVerificationRequest
  )
  .delete(
    auth('manageUsers'),
    validate(idVerificationValidation.deleteVerificationRequest),
    idVerificationController.deleteVerificationRequest
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: ID Verification
 *   description: ID verification management
 */

/**
 * @swagger
 * /id-verification/user:
 *   post:
 *     summary: Submit ID verification request
 *     tags: [ID Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idType
 *               - idFront
 *             properties:
 *               idType:
 *                 type: string
 *                 enum: [passport, driverLicense, nationalId, other]
 *               idFront:
 *                 type: string
 *               idBack:
 *                 type: string
 *             example:
 *               idType: passport
 *               idFront: /uploads/id_images/front_123.jpg
 *               idBack: /uploads/id_images/back_123.jpg
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         description: Bad request
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   get:
 *     summary: Get user's verification request
 *     tags: [ID Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /id-verification:
 *   get:
 *     summary: Get all verification requests (Admin only)
 *     tags: [ID Verification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected, all]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   patch:
 *     summary: Update verification status (Admin only)
 *     tags: [ID Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idVerifyId
 *               - status
 *             properties:
 *               idVerifyId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [verified, rejected]
 *               rejectionReason:
 *                 type: string
 *             example:
 *               idVerifyId: 507f1f77bcf86cd799439011
 *               status: verified
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
