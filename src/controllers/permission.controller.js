const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { permissionService } = require('../services');

const getAllRoles = catchAsync(async (req, res) => {
  const result = await permissionService.getAllRoles();
  res.send(result);
});

const getRolePermissions = catchAsync(async (req, res) => {
  const result = await permissionService.getRolePermissions(req.params.role);
  res.send(result);
});

const getUserPermissions = catchAsync(async (req, res) => {
  const result = await permissionService.getUserPermissions(req.params.userId);
  res.send(result);
});

const updateUserRole = catchAsync(async (req, res) => {
  const user = await permissionService.updateUserRole(req.params.userId, req.body.role);
  res.send(user);
});

const checkPermission = catchAsync(async (req, res) => {
  const hasPermission = await permissionService.hasPermission(req.params.userId, req.body.permission);
  res.send({ hasPermission });
});

const getUsersByRole = catchAsync(async (req, res) => {
  const users = await permissionService.getUsersByRole(req.params.role);
  res.send(users);
});

const getAllAdministrators = catchAsync(async (req, res) => {
  const admins = await permissionService.getAllAdministrators();
  res.send(admins);
});

module.exports = {
  getAllRoles,
  getRolePermissions,
  getUserPermissions,
  updateUserRole,
  checkPermission,
  getUsersByRole,
  getAllAdministrators,
};
