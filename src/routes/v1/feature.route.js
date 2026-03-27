const express = require("express");
const validate = require("../../middlewares/validate");
const featureValidation = require("../../validations/feature.validation");
const featureController = require("../../controllers/feature.controller");
const auth = require("../../middlewares/auth");
const {
  cleanupUploadedFiles,
} = require("../../middlewares/cleanupUploadedFiles");
const { uploadFeatureIcon: imgUpload } = require("../../middlewares/multer");
const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    imgUpload.single("icon"),
    featureValidation.validateIcon,
    validate(featureValidation.createFeature),
    cleanupUploadedFiles,
    featureController.addNewFeature,
  )
  .get(featureController.getFeatures)
  .put(
    auth("manageFeatures"),
    imgUpload.single("icon"),
    validate(featureValidation.editFeature),
    cleanupUploadedFiles,
    featureController.editFeature,
  );
router.delete(
  "/:featureId",
  auth("manageFeatures"),
  validate(featureValidation.deleteFeature),
  featureController.deleteFeature,
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: Features management
 */

/**
 * @swagger
 * /features:
 *   post:
 *     summary: Create a feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *                 example: Feature 1
 *               description:
 *                 type: string
 *                 example: Feature 1 description
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all features
 *     tags: [Features]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Feature name
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
 *           default: 10
 *         description: Maximum number of features
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feature'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   put:
 *     summary: Update a feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               featureId:
 *                 type: string
 *                 example: 61c0e8d6d6b9b9b9b9b9b9b9
 *               name:
 *                 type: string
 *                 example: Feature 1
 *               description:
 *                 type: string
 *                 example: Feature 1 description
 *               icon:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 enum: [pending, active, inactive]
 *                 example: active
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feature'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /features/{featureId}:
 *   delete:
 *     summary: Delete a feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: featureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Feature id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
