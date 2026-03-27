const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const permissionValidation = require('../../validations/permission.validation');
const permissionController = require('../../controllers/permission.controller');

const router = express.Router();

router.route('/roles').get(auth('managePermissions'), permissionController.getAllRoles);

router
  .route('/roles/:role')
  .get(auth('managePermissions'), validate(permissionValidation.getRolePermissions), permissionController.getRolePermissions);

router
  .route('/users/:userId/role')
  .get(auth('managePermissions'), validate(permissionValidation.getUserPermissions), permissionController.getUserPermissions)
  .patch(auth('managePermissions'), validate(permissionValidation.updateUserRole), permissionController.updateUserRole);

router
  .route('/users/:userId/check')
  .post(auth('managePermissions'), validate(permissionValidation.checkPermission), permissionController.checkPermission);

router
  .route('/roles/:role/users')
  .get(auth('managePermissions'), validate(permissionValidation.getUsersByRole), permissionController.getUsersByRole);

router.route('/administrators').get(auth('managePermissions'), permissionController.getAllAdministrators);

module.exports = router;
