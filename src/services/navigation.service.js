const httpStatus = require('http-status');
const { Navigation, Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create navigation item
 * @param {ObjectId} categoryId
 * @returns {Promise<Navigation>}
 */
const createNavigation = async (categoryId, section) => {
  // Check if category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // If navigation already exists for this category, optionally add the section
  const existingNav = await Navigation.findOne({ category: categoryId });

  if (existingNav) {
    // If section provided, ensure category supports it then add to sections array if not present
    if (section) {
      // enforce category.sections if provided
      if (Array.isArray(category.sections) && category.sections.length && !category.sections.includes(section)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Category is not available for the requested section');
      }

      existingNav.sections = Array.isArray(existingNav.sections) ? existingNav.sections : undefined;
      // if undefined -> treat as global => convert to explicit list of all sections first
      if (!existingNav.sections) {
        existingNav.sections = ['rent', 'hire', 'buy'];
      }
      if (existingNav.sections.includes(section)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Category already in navigation for this section');
      }
      existingNav.sections.push(section);
      await existingNav.save();
      return existingNav.populate('category');
    }

    // no section provided and nav exists -> keep backward behavior
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category already in navigation');
  }

  // Get the highest display order and increment
  const lastNav = await Navigation.findOne().sort({ displayOrder: -1 });
  const displayOrder = lastNav ? lastNav.displayOrder + 1 : 1;

  const navPayload = {
    category: categoryId,
    displayOrder,
  };
  if (section) navPayload.sections = [section];

  const navigation = await Navigation.create(navPayload);

  return navigation.populate('category');
};

/**
 * Query navigations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryNavigations = async (filter, options) => {
  const navigations = await Navigation.paginate(filter, {
    ...options,
    populate: 'category',
    sortBy: options.sortBy || 'displayOrder:asc',
  });
  return navigations;
};

/**
 * Get all navigations (no pagination)
 * @returns {Promise<Navigation[]>}
 */
const getAllNavigations = async () => {
  const navigations = await Navigation.find({ isActive: true }).populate('category').sort({ displayOrder: 1 });
  return navigations;
};

/**
 * Get navigation by id
 * @param {ObjectId} id
 * @returns {Promise<Navigation>}
 */
const getNavigationById = async (id) => {
  const navigation = await Navigation.findById(id).populate('category');
  if (!navigation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Navigation not found');
  }
  return navigation;
};

/**
 * Get all categories (for selection)
 * @returns {Promise<Category[]>}
 */
const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

/**
 * Get all categories with navigation status
 * @returns {Promise<Array>}
 */
const getAllCategoriesWithNavStatus = async () => {
  const categories = await Category.find();
  const navigations = await Navigation.find();

  // Create a map of category IDs to navigation info
  const navMap = {};
  navigations.forEach((nav) => {
    navMap[nav.category.toString()] = {
      id: nav._id.toString(),
      sections: Array.isArray(nav.sections) ? nav.sections.slice() : undefined, // undefined => global
    };
  });

  // Add navigation info to each category
  const categoriesWithStatus = categories.map((category) => {
    const categoryObj = category.toJSON();
    // Add back _id since frontend expects it (toJSON converts _id to id)
    categoryObj._id = category._id.toString();
    const nav = navMap[category._id.toString()] || null;
    categoryObj.isInNavigation = !!nav;
    categoryObj.navigation = nav; // { id, sections } or null
    return categoryObj;
  });

  return categoriesWithStatus;
};

/**
 * Update navigation
 * @param {ObjectId} navigationId
 * @param {Object} updateBody
 * @returns {Promise<Navigation>}
 */
const updateNavigation = async (navigationId, updateBody) => {
  const navigation = await getNavigationById(navigationId);

  if (updateBody.displayOrder !== undefined) {
    navigation.displayOrder = updateBody.displayOrder;
  }
  if (updateBody.isActive !== undefined) {
    navigation.isActive = updateBody.isActive;
  }

  // Add a single section
  if (updateBody.addSection) {
    // ensure category supports this section (navigation.category is populated by getNavigationById)
    if (
      navigation.category &&
      Array.isArray(navigation.category.sections) &&
      navigation.category.sections.length &&
      !navigation.category.sections.includes(updateBody.addSection)
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category is not available for the requested section');
    }

    navigation.sections = Array.isArray(navigation.sections) ? navigation.sections : ['rent', 'hire', 'buy'];
    if (navigation.sections.includes(updateBody.addSection)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Section already enabled for this navigation');
    }
    navigation.sections.push(updateBody.addSection);
  }

  // Remove a single section
  if (updateBody.removeSection) {
    // If sections not defined => treat as global and expand to all sections first
    navigation.sections = Array.isArray(navigation.sections) ? navigation.sections : ['rent', 'hire', 'buy'];
    navigation.sections = navigation.sections.filter((s) => s !== updateBody.removeSection);
    // If no sections remain, remove navigation entirely
    if (navigation.sections.length === 0) {
      await navigation.remove();
      return null;
    }
  }

  // Replace sections entirely
  if (Array.isArray(updateBody.sections)) {
    navigation.sections = updateBody.sections.slice();
    if (navigation.sections.length === 0) {
      await navigation.remove();
      return null;
    }
  }

  await navigation.save();
  return navigation.populate('category');
};

/**
 * Delete navigation
 * @param {ObjectId} navigationId
 * @returns {Promise<Navigation>}
 */
const deleteNavigation = async (navigationId) => {
  const navigation = await getNavigationById(navigationId);
  await navigation.remove();
  return navigation;
};

/**
 * Reorder navigations
 * @param {Array} orderArray - Array of {id, displayOrder}
 * @returns {Promise<void>}
 */
const reorderNavigations = async (orderArray) => {
  const updatePromises = orderArray.map((item) =>
    Navigation.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
  );
  await Promise.all(updatePromises);
};

module.exports = {
  createNavigation,
  queryNavigations,
  getAllNavigations,
  getNavigationById,
  getAllCategories,
  getAllCategoriesWithNavStatus,
  updateNavigation,
  deleteNavigation,
  reorderNavigations,
};
