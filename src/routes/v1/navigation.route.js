const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const navigationValidation = require('../../validations/navigation.validation');
const navigationController = require('../../controllers/navigation.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageCategories'), validate(navigationValidation.createNavigation), navigationController.createNavigation)
  .get(validate(navigationValidation.getNavigations), navigationController.getNavigations);

router.route('/get-all').get(navigationController.getAllNavigations);

router.route('/get-all-with-status').get(auth('manageCategories'), navigationController.getAllCategoriesWithNavStatus);

router.route('/get-all-categories').get(auth('manageCategories'), navigationController.getAllCategories);

router
  .route('/reorder')
  .post(
    auth('manageCategories'),
    validate(navigationValidation.reorderNavigations),
    navigationController.reorderNavigations
  );

router
  .route('/:navigationId')
  .get(validate(navigationValidation.getNavigation), navigationController.getNavigation)
  .patch(auth('manageCategories'), validate(navigationValidation.updateNavigation), navigationController.updateNavigation)
  .delete(auth('manageCategories'), validate(navigationValidation.deleteNavigation), navigationController.deleteNavigation);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Navigations
 *   description: Navigation menu management
 */

/**
 * @swagger
 * /navigations:
 *   post:
 *     summary: Create a navigation item
 *     tags: [Navigations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *             properties:
 *               categoryId:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all navigation items
 *     tags: [Navigations]
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
 */

/**
 * @swagger
 * /navigations/get-all:
 *   get:
 *     summary: Get all active navigation items (no pagination)
 *     tags: [Navigations]
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /navigations/get-all-categories:
 *   get:
 *     summary: Get all categories for navigation selection
 *     tags: [Navigations]
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
 * /navigations/{id}:
 *   delete:
 *     summary: Delete a navigation item
 *     tags: [Navigations]
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
