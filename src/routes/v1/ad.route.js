const express = require("express");
const validate = require("../../middlewares/validate");
const adValidation = require("../../validations/ad.validation");
const adController = require("../../controllers/ad.controller");
const auth = require("../../middlewares/auth");
const {
  cleanupUploadedFiles,
} = require("../../middlewares/cleanupUploadedFiles");
const { uploadAdImage: imgUpload } = require("../../middlewares/multer");
const router = express.Router();

// user routes
router
  .route("/")
  .post(
    auth(),
    imgUpload.fields([{ name: "mainImg", maxCount: 1 }, { name: "subImgs" }]),
    validate(adValidation.createAd),
    cleanupUploadedFiles,
    adController.createAd,
  )
  .get(adController.getAds);
router.get("/user/getAll", auth(), adController.getUserAds);
router.get(
  "/user/get/:adId",
  auth(),
  validate(adValidation.adId),
  adController.getUserAd,
);
router
  .route("/:adId")
  .get(validate(adValidation.adId), adController.getAd)
  .delete(auth(), validate(adValidation.adId), adController.removeAd)
  .put(
    auth(),
    imgUpload.fields([{ name: "mainImg", maxCount: 1 }, { name: "subImgs" }]),
    validate(adValidation.editAd),
    cleanupUploadedFiles,
    adController.editAd,
  )
  .patch(
    auth(),
    validate(adValidation.userStatusChange),
    adController.changeUserAdStatus,
  );
// admin routes
router.get("/admin/getAll", auth("manageAds"), adController.getAdminAds);
router.get(
  "/admin/get/:adId",
  auth("manageAds"),
  validate(adValidation.adId),
  adController.getAdminAd,
);
router.patch(
  "/admin/change-status/:adId/:status",
  auth("manageAds"),
  validate(adValidation.adminStatusChange),
  adController.changeAdminAdStatus,
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: Ads management
 */

/**
 * @swagger
 * /ads:
 *   post:
 *     summary: Create an ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - subCategory
 *               - rentFrequency
 *               - priceType
 *               - rentType
 *               - mainImg
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ad 1
 *               description:
 *                 type: string
 *                 example: Ad 1 description
 *               category:
 *                 type: string
 *                 example: 60a8b6a0e0b2a0b2a0b2a0b2
 *               subCategory:
 *                 type: string
 *                 example: 60a8b6a0e0b2a0b2a0b2a0b2
 *               rentFrequency:
 *                 type: string
 *                 example: monthly
 *               priceType:
 *                 type: string
 *                 example: Fixed
 *               price:
 *                 type: number
 *               rentType:
 *                 type: string
 *                 example: offered
 *               isShipping:
 *                 type: boolean
 *                 example: false
 *               addOns:
 *                 type: array
 *                 example: []
 *               totalAddonCharge:
 *                 type: number
 *                 example: 0
 *               mainImg:
 *                 type: string
 *                 format: binary
 *               subImgs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all ads for users
 *     tags: [Ads]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: laptop
 *       - in: query
 *         name: similarTitle
 *         schema:
 *           type: string
 *         description: laptop
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category id
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: SubCategory id
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
 *         description: Maximum number of ads
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
 *               type: array
 */

/**
 * @swagger
 * /ads/user/getAll:
 *   get:
 *     summary: Get all ads for user
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: laptop
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category id
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: SubCategory id
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
 *         description: Maximum number of ads
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
 *               type: array
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /ads/user/get/{adId}:
 *   get:
 *     summary: Get an ad for user
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /ads/{adId}:
 *   get:
 *     summary: Get an ad by id
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update an ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ad 1
 *               description:
 *                 type: string
 *                 example: Ad 1 description
 *               category:
 *                 type: string
 *                 example: 60a8b6a0e0b2a0b2a0b2a0b2
 *               subCategory:
 *                 type: string
 *                 example: 60a8b6a0e0b2a0b2a0b2a0b2
 *               rentFrequency:
 *                 type: string
 *                 example: monthly
 *               priceType:
 *                 type: string
 *                 example: Fixed
 *               price:
 *                 type: number
 *                 example: 1000
 *               rentType:
 *                 type: string
 *                 example: offered
 *               isShipping:
 *                 type: boolean
 *                 example: false
 *               addOns:
 *                 type: array
 *                 example: []
 *               totalAddonCharge:
 *                 type: number
 *                 example: 0
 *               status:
 *                 type: string
 *                 example: pending
 *               mainImg:
 *                 type: string
 *                 format: binary
 *               subImgs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               subImages:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Change ad status for user
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad id
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           example: active
 *         required: true
 *         description: Ad status (active or inactive)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /ads/admin/getAll:
 *   get:
 *     summary: Get all ads for admin
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: laptop
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: category id
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: subCategory id
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
 *         description: Maximum number of ads
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
 *               type: array
 */

/**
 * @swagger
 * /ads/admin/get/{adId}:
 *   get:
 *     summary: Get an ad for admin
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /ads/admin/change-status/{adId}/{status}:
 *   patch:
 *     summary: Change ad status for admin
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad id
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: Ad status
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
