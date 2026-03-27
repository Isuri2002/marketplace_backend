const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'manageCategories',
    'manageAds',
    'manageReviews',
    'manageFeatures',
    'manageAddons',
    'manageDynamicFields',
    'getAuditLogs',
    'manageAuditLogs',
    'getDashboardMetrics',
    'managePermissions',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
