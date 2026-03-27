const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');
const { cleanupFiles } = require('../utils/fileCleanup');

/**
 * Add a category
 * @param {Object} category
 * @returns {Promise<Category>}
 */
const createCategory = async (category) => {
  try {
    if (category.body.subCategories.length > 0) {
      for (let i = 0; i < category.body.subCategories.length; i++) {
        category.body.subCategories[i].icon = category.files.subCategoryIcons[i].filename;
      }
    }
    const categoryData = {
      name: category.body.name,
      description: category.body.description,
      icon: category.files.icon[0].filename,
      subCategories: category.body.subCategories,
    };

    // If sections were provided in the multipart/form-data body, normalize & dedupe them
    if (category.body.sections) {
      let secs = category.body.sections;
      if (typeof secs === 'string') {
        try {
          secs = JSON.parse(secs);
        } catch (err) {
          secs = secs
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      if (!Array.isArray(secs)) secs = [secs];
      secs = Array.from(new Set(secs.map((s) => String(s).trim()).filter(Boolean)));
      if (secs.length) categoryData.sections = secs;
    }

    if (await Category.isCategoryExist(categoryData.name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category already exist');
    }
    return Category.create(categoryData);
  } catch (error) {
    const uploadedFiles = [];
    if (category.files.icon) {
      uploadedFiles.push(path.join('public/uploads/category_icons', category.files.icon[0].filename));
    }
    if (category.files.subCategoryIcons) {
      for (let i = 0; i < category.files.subCategoryIcons.length; i++) {
        uploadedFiles.push(path.join('public/uploads/category_icons', category.files.subCategoryIcons[i].filename));
      }
    }
    cleanupFiles(uploadedFiles);
    throw error;
  }
};

/**
 * Get all categories
 * @param {ObjectId} categoryId
 * @returns {Promise<Category[]>}
 */
const findCategories = async (categoryId, section) => {
  if (categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    return category;
  }

  // If a section is provided, return categories that are either global (no sections set)
  // or explicitly include the requested section. Otherwise return all categories.
  if (section) {
    return Category.find({
      $or: [{ sections: { $in: [section] } }, { sections: { $exists: false } }, { sections: { $eq: [] } }],
    });
  }

  return Category.find();
};

/**
 * Update a category
 * @param {ObjectId} categoryId
 * @param {Object} newCategoryData
 * @returns {Promise<Category>}
 */
const updateCategory = async (categoryId, newCategoryData) => {
  try {
    const currentCategoryData = await Category.findOne({ _id: categoryId });
    if (!currentCategoryData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    if (newCategoryData.files && newCategoryData.files.icon) {
      const currentIcon = currentCategoryData.icon;
      if (currentIcon) {
        const currentPath = path.join('public', 'uploads', 'category_icons', currentIcon);
        if (fs.existsSync(currentPath)) {
          try {
            fs.unlinkSync(currentPath);
          } catch (e) {
            // log and continue
            console.warn('Failed to remove current category icon', currentPath, e.message);
          }
        }
      }
      newCategoryData.body.icon = newCategoryData.files.icon[0].filename;
    }

    // Normalize and dedupe sections (guard against FormData sending JSON strings)
    if (newCategoryData.body && newCategoryData.body.sections) {
      let secs = newCategoryData.body.sections;
      if (typeof secs === 'string') {
        try {
          secs = JSON.parse(secs);
        } catch (err) {
          secs = secs
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      if (!Array.isArray(secs)) secs = [secs];
      newCategoryData.body.sections = Array.from(new Set(secs));
    }

    if (Array.isArray(newCategoryData.body.subCategories) && newCategoryData.body.subCategories.length > 0) {
      // iterate backward when removing items to avoid index shifts
      for (let i = newCategoryData.body.subCategories.length - 1; i >= 0; i--) {
        const subCategory = newCategoryData.body.subCategories[i];
        if (subCategory && subCategory.status) {
          if ((subCategory.status === 'deleted' || subCategory.status === 'updated') && subCategory.icon) {
            const subPath = path.join('public', 'uploads', 'category_icons', subCategory.icon);
            if (fs.existsSync(subPath)) {
              try {
                fs.unlinkSync(subPath);
              } catch (e) {
                console.warn('Failed to remove subcategory icon', subPath, e.message);
              }
            }
          }
          if (subCategory.status === 'deleted') {
            newCategoryData.body.subCategories.splice(i, 1);
            continue;
          }
          if (subCategory.status === 'updated' || subCategory.status === 'new') {
            if (newCategoryData.files && newCategoryData.files.subCategoryIcons) {
              const found = newCategoryData.files.subCategoryIcons.find(
                (categoryIcon) => (categoryIcon.originalname || '').replace(/\.[^/.]+$/, '') === subCategory.name
              );
              if (found) subCategory.icon = found.filename;
            }
            delete subCategory.status;
          }
        }
      }
    }
    return Category.findOneAndUpdate({ _id: categoryId }, newCategoryData.body, { new: true });
  } catch (error) {
    const uploadedFiles = [];
    if (newCategoryData.files && newCategoryData.files.icon) {
      uploadedFiles.push(path.join('public', 'uploads', 'category_icons', newCategoryData.files.icon[0].filename));
    }
    if (newCategoryData.files && newCategoryData.files.subCategoryIcons) {
      newCategoryData.files.subCategoryIcons.forEach((subCategory) => {
        uploadedFiles.push(path.join('public', 'uploads', 'category_icons', subCategory.filename));
      });
    }
    cleanupFiles(uploadedFiles);
    throw error;
  }
};

/**
 * Delete a category
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategory = async (categoryId) => {
  const category = await Category.findOne({ _id: categoryId });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await Category.deleteOne({ _id: categoryId });
  return category;
};

module.exports = {
  createCategory,
  findCategories,
  updateCategory,
  deleteCategory,
};
