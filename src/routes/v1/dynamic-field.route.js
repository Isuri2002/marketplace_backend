const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const dynamicFieldValidation = require('../../validations/dynamic-field.validation');
const categoryDynamicFieldController = require('../../controllers/dynamic-fields.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageDynamicFields'),
    validate(dynamicFieldValidation.createDynamicField),
    categoryDynamicFieldController.createDynamicFields
  )
  .get(validate(dynamicFieldValidation.getDynamicFields), categoryDynamicFieldController.getDynamicFields)
  .put(
    auth('manageDynamicFields'),
    validate(dynamicFieldValidation.editDynamicField),
    categoryDynamicFieldController.editDynamicFields
  );

router
  .route('/:dynamicFieldId')
  .delete(
    auth('manageDynamicFields'),
    validate(dynamicFieldValidation.deleteDynamicField),
    categoryDynamicFieldController.deleteDynamicFields
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Dynamic Fields
 *   description: Dynamic Fields
 */

/**
 * @swagger
 * /dynamic-fields:
 *   post:
 *     summary: Create a dynamic field
 *     tags: [Dynamic Fields]
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
 *               - fields
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: Category id
 *                 example: "5f5f5f5f5f5f5f5f5f5f5f5f"
 *               fields:
 *                 type: array
 *                 description: Dynamic fields
 *                 items:
 *                   type: object
 *                   required:
 *                     - label
 *                     - type
 *                   properties:
 *                     label:
 *                       type: string
 *                       description: Dynamic field label
 *                       example: "color"
 *                     type:
 *                       type: string
 *                       description: Dynamic field type
 *                       enum: ["select", "text", "number", "textarea", "radio", "checkbox"]
 *                       example: "select"
 *                     options:
 *                       type: array
 *                       description: Dynamic field options
 *                       example: ["red", "green", "blue"]
 *                     placeholder:
 *                       type: string
 *                       description: Dynamic field placeholder
 *                       example: "Select color"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categoryFields:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DynamicFields'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get dynamic fields
 *     tags: [Dynamic Fields]
 *     parameters:
 *       - in: query
 *         name: categoryIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["5f5f5f5f5f5f5f5f5f5f5f5f", "5f5f5f5f5f5f5f5f5f5f5f5f"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DynamicFields'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     summary: Update a dynamic field
 *     tags: [Dynamic Fields]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dynamicFieldId:
 *                 type: string
 *                 description: Dynamic field id
 *                 example: "5f5f5f5f5f5f5f5f5f5f5f5f"
 *               fields:
 *                 type: array
 *                 description: Dynamic fields
 *                 items:
 *                   type: object
 *                   required:
 *                     - label
 *                     - type
 *                   properties:
 *                     label:
 *                       type: string
 *                       description: Dynamic field label
 *                       example: "color"
 *                     type:
 *                       type: string
 *                       description: Dynamic field type
 *                       enum: ["select", "text", "number", "textarea", "radio", "checkbox"]
 *                       example: "select"
 *                     options:
 *                       type: array
 *                       description: Dynamic field options
 *                       example: ["red", "green", "blue"]
 *                     placeholder:
 *                       type: string
 *                       description: Dynamic field placeholder
 *                       example: "Select color"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DynamicFields'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a dynamic field
 *     tags: [Dynamic Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dynamicFieldId
 *         schema:
 *           type: string
 *           example: "5f5f5f5f5f5f5f5f5f5f5f5f"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DynamicFields'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
