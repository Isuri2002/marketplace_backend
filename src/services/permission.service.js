const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { roles, roleRights } = require('../config/roles');

/**
 * Get all available roles
 * @returns {Promise<Array>}
 */
const getAllRoles = async () => {
  return roles.map((role) => ({
    role,
    permissions: roleRights.get(role) || [],
  }));
};

/**
 * Get role permissions
 * @param {string} role
 * @returns {Promise<Array>}
 */
const getRolePermissions = async (role) => {
  if (!roles.includes(role)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  return roleRights.get(role) || [];
};

/**
 * Get user permissions
 * @param {ObjectId} userId
 * @returns {Promise<Object>}
 */
const getUserPermissions = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return {
    userId: user._id,
    role: user.role,
    permissions: roleRights.get(user.role) || [],
  };
};

/**
 * Update user role
 * @param {ObjectId} userId
 * @param {string} newRole
 * @returns {Promise<User>}
 */
const updateUserRole = async (userId, newRole) => {
  if (!roles.includes(newRole)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.role = newRole;
  await user.save();
  return user;
};

/**
 * Check if user has specific permission
 * @param {ObjectId} userId
 * @param {string} permission
 * @returns {Promise<boolean>}
 */
const hasPermission = async (userId, permission) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userPermissions = roleRights.get(user.role) || [];
  return userPermissions.includes(permission);
};

/**
 * Get all users by role
 * @param {string} role
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
const getUsersByRole = async (role, options = {}) => {
  if (!roles.includes(role)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  const users = await User.find({ role })
    .select('-password')
    .limit(options.limit || 100)
    .skip(options.skip || 0);
  return users;
};

/**
 * Get all administrators
 * @returns {Promise<Array>}
 */
const getAllAdministrators = async () => {
  const admins = await User.find({ role: 'admin' }).select('-password');
  return admins.map((admin) => ({
    id: admin._id,
    name: `${admin.firstName} ${admin.lastName}`,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    createdAt: admin.createdAt,
    permissions: roleRights.get(admin.role) || [],
  }));
};

module.exports = {
  getAllRoles,
  getRolePermissions,
  getUserPermissions,
  updateUserRole,
  hasPermission,
  getUsersByRole,
  getAllAdministrators,
};
