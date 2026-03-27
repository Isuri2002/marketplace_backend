const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const {
  cleanupUploadedFiles,
} = require("../../middlewares/cleanupUploadedFiles");
const categoryValidation = require("../../validations/category.validation");
const categoryController = require("../../controllers/category.controller");
const { uploadCategoryIcon: imgUpload } = require("../../middlewares/multer");
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageCategories"),
    imgUpload.fields([
      { name: "icon", maxCount: 1 },
      { name: "subCategoryIcons" },
    ]),
    categoryValidation.validateSubCategories,
    categoryValidation.validateFiles,
    validate(categoryValidation.categoryData),
    cleanupUploadedFiles,
    categoryController.addNewCategory,
  )
  .get(categoryController.getCategories);

router
  .route("/:categoryId")
  .patch(
    auth("manageCategories"),
    imgUpload.fields([
      { name: "icon", maxCount: 1 },
      { name: "subCategoryIcons" },
    ]),
    validate(categoryValidation.categoryId),
    categoryValidation.validateSubCategories,
    cleanupUploadedFiles,
    categoryController.editCategory,
  )
  .delete(
    auth("manageCategories"),
    validate(categoryValidation.categoryId),
    categoryController.removeCategory,
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories management
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
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
 *                 example: Category 1
 *               description:
 *                 type: string
 *                 example: Category 1 description
 *               icon:
 *                 type: string
 *                 format: binary
 *               subCategories:
 *                 type: string
 *                 example: '[{"name": "Laptops", "description": "Various brands of laptops"}]'
 *               subCategoryIcons:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Icons for each subCategory
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/DuplicateCategory'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Category id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   patch:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Category 1
 *               description:
 *                 type: string
 *                 example: Category 1 description
 *               iconImg:
 *                 type: string
 *                 description: current icon name which is from the backend for the category.
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: New icon for the category to be uploaded if there is a new icon
 *               subCategories:
 *                 type: string
 *                 example: '[{"name": "Laptops", "description": "Various brands of laptops"}]'
 *                 description: Current subCategories for the category from the backend. If there are new subCategories, current subCategories need to be deleted or current subCategory's icon need to be updated, then a new element called status should added to the relevant subCategories (new/updated/deleted).
 *               subCategoryIcons:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Icons for each new or updated subCategories. the originalname of those icon should be changed to the name of the subCategory
 *     responses:
 *       "200":
 *         description: No content
 *       "400":
 *         $ref: '#/components/responses/DuplicateCategory'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
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
