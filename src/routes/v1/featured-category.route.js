const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const featuredCategoryValidation = require("../../validations/featured-category.validation");
const featuredCategoryController = require("../../controllers/featured-category.controller");
const router = express.Router();
const {
  uploadFeaturedCategoryImage: imageUpload,
} = require("../../middlewares/multer");

router
  .route("/")
  .post(
    auth("manageCategories"),
    imageUpload.single("image"),
    validate(featuredCategoryValidation.createFeaturedCategory),
    featuredCategoryController.createFeaturedCategory,
  )
  .get(
    validate(featuredCategoryValidation.getFeaturedCategories),
    featuredCategoryController.getFeaturedCategories,
  )
  .put(
    auth("manageCategories"),
    imageUpload.single("image"),
    validate(featuredCategoryValidation.updateFeaturedCategory),
    featuredCategoryController.updateFeaturedCategory,
  );

router.route("/all").get(featuredCategoryController.getAllFeaturedCategories);

router
  .route("/not-featured")
  .get(
    auth("manageCategories"),
    featuredCategoryController.getNotFeaturedCategories,
  );

router
  .route("/reorder")
  .post(
    auth("manageCategories"),
    validate(featuredCategoryValidation.reorderFeaturedCategories),
    featuredCategoryController.reorderFeaturedCategories,
  );

router
  .route("/:featuredCategoryId")
  .get(
    validate(featuredCategoryValidation.getFeaturedCategory),
    featuredCategoryController.getFeaturedCategory,
  )
  .delete(
    auth("manageCategories"),
    validate(featuredCategoryValidation.deleteFeaturedCategory),
    featuredCategoryController.deleteFeaturedCategory,
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Featured Categories
 *   description: Featured category management
 */

/**
 * @swagger
 * /featured-categories:
 *   post:
 *     summary: Create a featured category
 *     tags: [Featured Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - image
 *             properties:
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all featured categories
 *     tags: [Featured Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: OK
 *   put:
 *     summary: Update a featured category
 *     tags: [Featured Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               displayOrder:
 *                 type: integer
 *               isActive:
 *                 type: boolean
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

/**
 * @swagger
 * /featured-categories/not-featured:
 *   get:
 *     summary: Get categories that are not featured
 *     tags: [Featured Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /featured-categories/{id}:
 *   delete:
 *     summary: Delete a featured category
 *     tags: [Featured Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
