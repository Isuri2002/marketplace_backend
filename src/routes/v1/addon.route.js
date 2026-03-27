const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const addonValidation = require('../../validations/addon.validation');
const addonController = require('../../controllers/addon.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageAddons'), validate(addonValidation.createAddOn), addonController.createAddon)
  .get(addonController.getAddons)
  .patch(auth('manageAddons'), validate(addonValidation.editAddOn), addonController.editAddon);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Addons
 *   description: Addons management
 */

/**
 * @swagger
 *  /addons:
 *    post:
 *      summary: Create a addon
 *      tags: [Addons]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - description
 *                - price
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                price:
 *                  type: number
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  addon:
 *                    $ref: '#/components/schemas/AddOn'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all addons
 *      tags: [Addons]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/AddOn'
 *
 *    patch:
 *      summary: Edit a addon
 *      tags: [Addons]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                addOnId:
 *                  type: string
 *                  example: 61a4a7d1c5db1b4f5e6d7f8b
 *                name:
 *                  type: string
 *                  example: New Name
 *                description:
 *                  type: string
 *                  example: New Description
 *                price:
 *                  type: number
 *                  example: 100
 *                status:
 *                  type: string
 *                  example: active
 *                  enum: [active, inactive]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  addon:
 *                    $ref: '#/components/schemas/AddOn'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
