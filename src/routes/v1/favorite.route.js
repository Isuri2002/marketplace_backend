const express = require('express');
const validate = require('../../middlewares/validate');
const favoriteValidation = require('../../validations/favorite.validation');
const favoriteController = require('../../controllers/favorite.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/').get(auth(), favoriteController.getUserFavorites);

router
  .route('/:adId')
  .post(auth(), validate(favoriteValidation.adId), favoriteController.addFavorite)
  .delete(auth(), validate(favoriteValidation.adId), favoriteController.removeFavorite)
  .get(auth(), validate(favoriteValidation.adId), favoriteController.checkFavorite);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Favorite ads management
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get user's favorite ads
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (default -createdAt)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 50
 *         description: Maximum number of favorites
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
 */

/**
 * @swagger
 * /favorites/{adId}:
 *   post:
 *     summary: Add ad to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ad id
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         description: Already in favorites
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Ad not found
 *
 *   delete:
 *     summary: Remove ad from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ad id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Favorite not found
 *
 *   get:
 *     summary: Check if ad is in favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ad id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
