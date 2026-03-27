const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router.post('/add-review', auth(), validate(reviewValidation.createReview), reviewController.createReview);
router.get('/get-ad-reviews', validate(reviewValidation.getReviewsForAd), reviewController.getReviewsForAd);
router.get('/get-reviews', auth('manageReviews'), validate(reviewValidation.getReviews), reviewController.getReviews);
router.get('/get-section-reviews', validate(reviewValidation.getSectionReviews), reviewController.getSectionReviews);
router.put('/edit-review', auth('manageReviews'), validate(reviewValidation.editReview), reviewController.editReview);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management and retrieval
 */

/**
 * @swagger
 *  /reviews/add-review:
 *    post:
 *      summary: Create a review
 *      tags: [Reviews]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - adId
 *                - rating
 *                - comment
 *              properties:
 *                adId:
 *                  type: string
 *                  description: Ad Id
 *                rating:
 *                  type: number
 *                  description: Rating (1 - 5)
 *                comment:
 *                  type: string
 *                  description: User comment about ad
 *              example:
 *                adId: 62e2f9f6a7c0c9b0e9b0e9b0
 *                rating: 3
 *                comment: lorem ipsum dolor sit amet consectetur adipisicing elit.
 *      responses:
 *        "201":
 *          description: Created
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 *  /reviews/get-ad-reviews:
 *    get:
 *      summary: Get reviews for ad
 *      tags: [Reviews]
 *      parameters:
 *        - in: query
 *          name: adId
 *          required: true
 *          schema:
 *            type: string
 *          description: Ad Id
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: Sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 10
 *          description: Maximum number of reviews
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 *  /reviews/get-reviews:
 *    get:
 *      summary: Get reviews
 *      tags: [Reviews]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: Sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 10
 *          description: Maximum number of reviews
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 *  /reviews/edit-review:
 *    put:
 *      summary: Edit review
 *      tags: [Reviews]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - adId
 *                - rating
 *                - comment
 *                - status
 *              properties:
 *                adId:
 *                  type: string
 *                rating:
 *                  type: number
 *                comment:
 *                  type: string
 *                status:
 *                  type: string
 *              example:
 *                adId: 62e2f9f6a7c0c9b0e9b0e9b0
 *                rating: 3
 *                comment: lorem ipsum dolor sit amet consectetur adipisicing elit.
 *                status: approved
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
