const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');
const { Ad, Addons } = require('../models');
const { validateCategoryAndSubCategory } = require('../utils/categoryValidate');
const ApiError = require('../utils/ApiError');
const { cleanupFiles } = require('../utils/fileCleanup');
const { sanitizeFilename } = require('../utils/filenameSanitize');

const normalizeAdditionalInfo = (additionalInfo) => {
  if (!additionalInfo) {
    return undefined;
  }

  let parsed = additionalInfo;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch (error) {
      return undefined;
    }
  }

  if (Array.isArray(parsed)) {
    return parsed.reduce((acc, entry) => {
      if (!entry || !entry.label) return acc;
      acc[String(entry.label).trim()] = entry.value === undefined || entry.value === null ? '' : String(entry.value);
      return acc;
    }, {});
  }

  if (parsed && typeof parsed === 'object') {
    return Object.entries(parsed).reduce((acc, [label, value]) => {
      if (!label) return acc;
      acc[String(label).trim()] = value === undefined || value === null ? '' : String(value);
      return acc;
    }, {});
  }

  return undefined;
};

const parseJsonIfNeeded = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const normalizeSkills = (value) => {
  const parsed = parseJsonIfNeeded(value, value);

  if (Array.isArray(parsed)) {
    return parsed.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (typeof parsed === 'string') {
    return parsed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeFeatures = (value) => {
  const parsed = parseJsonIfNeeded(value, []);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => {
      if (item && typeof item === 'object') {
        const title = String(item.title || '').trim();
        const description = String(item.description || '').trim();
        return title || description ? { ...item, title, description } : null;
      }

      const text = String(item || '').trim();
      return text ? { title: text, description: '' } : null;
    })
    .filter(Boolean);
};

const normalizePortfolioItems = (value) => {
  const parsed = parseJsonIfNeeded(value, []);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.map((item) => (item && typeof item === 'object' ? item : null)).filter(Boolean);
};

const normalizePackages = (value) => {
  const parsed = parseJsonIfNeeded(value, []);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const name = String(item.name || '').trim();
      const description = String(item.description || '').trim();
      const price = item.price === '' || item.price === null || item.price === undefined ? 0 : Number(item.price);

      return {
        ...item,
        name,
        description,
        price: Number.isNaN(price) ? 0 : price,
      };
    })
    .filter(Boolean);
};

const normalizeFaqs = (value) => {
  const parsed = parseJsonIfNeeded(value, []);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const question = String(item.question || '').trim();
      const answer = String(item.answer || '').trim();

      return question || answer ? { ...item, question, answer } : null;
    })
    .filter(Boolean);
};

/**
 * Create a ad
 * @param {ObjectId} userId
 * @param {Object} images
 * @param {Object} adBody
 * @returns {Promise<Ad>}
 */
const createAd = async (userId, images, adBody) => {
  try {
    // retrieve addons prices
    const addOnsPrices = await Addons.find({});
    await validateCategoryAndSubCategory(adBody.category, adBody.subCategory); // check category/sub category exists
    adBody.userId = userId;
    if (images?.mainImg?.length) {
      adBody.mainImage = sanitizeFilename(images.mainImg[0].filename);
    }
    adBody.subImages = images.subImgs ? images.subImgs.map((img) => sanitizeFilename(img.filename)) : [];
    adBody.addOns = !adBody.addOns ? [] : typeof adBody.addOns === 'string' ? adBody.addOns.split(',') : adBody.addOns;

    adBody.languages = normalizeSkills(adBody.languages);
    adBody.skills = normalizeSkills(adBody.skills);
    adBody.features = normalizeFeatures(adBody.features);
    adBody.portfolioItems = normalizePortfolioItems(adBody.portfolioItems);
    adBody.packages = normalizePackages(adBody.packages);
    adBody.faqs = normalizeFaqs(adBody.faqs);

    // Parse and normalize location/address fields if provided
    if (adBody.latitude !== undefined && adBody.latitude !== null) {
      const lat = Number(adBody.latitude);
      if (!Number.isNaN(lat)) adBody.latitude = lat;
    }
    if (adBody.longitude !== undefined && adBody.longitude !== null) {
      const lng = Number(adBody.longitude);
      if (!Number.isNaN(lng)) adBody.longitude = lng;
    }
    adBody.address = adBody.address ? String(adBody.address).trim() : '';
    adBody.addressLine1 = adBody.addressLine1 || '';
    if (!adBody.addressLine1 && adBody.address) {
      adBody.addressLine1 = adBody.address;
    }
    adBody.addressLine2 = adBody.addressLine2 || '';
    adBody.city = adBody.city || '';
    adBody.zipCode = adBody.zipCode || '';
    const parsedAdditionalInfo = normalizeAdditionalInfo(adBody.additionalInfo);
    if (parsedAdditionalInfo) {
      adBody.additionalInfo = parsedAdditionalInfo;
    } else {
      delete adBody.additionalInfo;
    }
    // Calculate total price
    adBody.totalAddonCharge = adBody.addOns.reduce((total, id) => {
      const addon = addOnsPrices.find((item) => item._id === id);
      return addon ? total + addon.price : total;
    }, 0);
    return Ad.create(adBody);
  } catch (error) {
    cleanupFiles(prepareUploadFiles(images));
    throw error;
  }
};

/**
 * Get ads for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<ads>}
 */
const getAds = async (filter, options) => {
  filter.status = 'active';
  options.populate = 'category';
  const ads = await Ad.paginate(filter, options);
  return ads;
};

/**
 *
 * @param {ObjectId} adId
 * @returns {Promise<Ad>}
 */
const getAdById = async (adId) => {
  const ad = await Ad.findOne({ _id: adId, status: 'active' })
    .populate('userId', 'firstName lastName addressLine1 addressLine2 city zipCode')
    .populate('category', 'name subCategories');
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found');
  }
  return ad;
};

/**
 * Get user ads
 * @param {ObjectId} userId
 * @returns {Promise<Ad>}
 */
const getUserAds = async (userId, filter, options) => {
  filter.userId = userId;
  const ads = await Ad.paginate(filter, options);
  return ads;
};

/**
 * Get user ad by id
 * @param {ObjectId} userId
 * @param {ObjectId} adId
 * @returns {Promise<Ad>}
 */
const getUserAdById = async (userId, adId) => {
  const ad = await Ad.findOne({ userId, _id: adId });
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found');
  }
  return ad;
};

/**
 * Update an ad by id
 * @param {ObjectId} adId
 * @param {Object} updateBody
 * @returns {Promise<Ad>}
 */
const editAdById = async (userId, adId, updatedImages, updatedBody) => {
  try {
    const ad = await Ad.findOne({ userId, _id: adId });
    if (!ad) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found');
    }
    await validateCategoryAndSubCategory(updatedBody.category, updatedBody.subCategory); // check category/sub category exists
    updatedBody.status = 'pending'; // make the ad status pending after editing
    updatedBody.addOns = !updatedBody.addOns
      ? []
      : typeof updatedBody.addOns === 'string'
      ? updatedBody.addOns.split(',')
      : updatedBody.addOns;

    updatedBody.languages = normalizeSkills(updatedBody.languages);
    updatedBody.skills = normalizeSkills(updatedBody.skills);
    updatedBody.features = normalizeFeatures(updatedBody.features);
    updatedBody.portfolioItems = normalizePortfolioItems(updatedBody.portfolioItems);
    updatedBody.packages = normalizePackages(updatedBody.packages);
    updatedBody.faqs = normalizeFaqs(updatedBody.faqs);

    // update main image if provided
    if (updatedImages?.mainImg?.length) {
      updatedBody.mainImage = sanitizeFilename(updatedImages.mainImg[0].filename);
      if (ad.mainImage) {
        fs.unlink(imgsFilePath(ad.mainImage), (err) => {
          if (err) throw err;
        });
      }
    }
    // deleted sub images remove
    ad.subImages.forEach((img) => {
      if (!updatedBody.subImages.includes(img)) {
        fs.unlink(imgsFilePath(img), (err) => {
          if (err) throw err;
        });
      }
    });
    // update sub images if new sub images
    if (updatedImages.subImgs) {
      updatedImages.subImgs
        .map((img) => sanitizeFilename(img.filename))
        .forEach((filename) => {
          updatedBody.subImages.push(filename);
        });
    } else {
      updatedBody.subImages = updatedBody.subImages || [];
    }
    // Parse coordinates when editing
    if (updatedBody.latitude !== undefined && updatedBody.latitude !== null) {
      const lat = Number(updatedBody.latitude);
      if (!Number.isNaN(lat)) updatedBody.latitude = lat;
    }
    if (updatedBody.longitude !== undefined && updatedBody.longitude !== null) {
      const lng = Number(updatedBody.longitude);
      if (!Number.isNaN(lng)) updatedBody.longitude = lng;
    }
    const parsedAdditionalInfo = normalizeAdditionalInfo(updatedBody.additionalInfo);
    if (parsedAdditionalInfo) {
      updatedBody.additionalInfo = parsedAdditionalInfo;
    } else {
      delete updatedBody.additionalInfo;
    }
    return Ad.findOneAndUpdate({ _id: adId }, updatedBody, { new: true });
  } catch (error) {
    cleanupFiles(prepareUploadFiles(updatedImages));
    throw error;
  }
};

/**
 * Change ad status for user
 * @param {ObjectId} userId
 * @param {ObjectId} adId
 * @param {string} status
 * @returns {Promise<Ad>}
 */
const changeUserAdStatus = async (userId, adId, status) => {
  const ad = await Ad.findOne({ userId, _id: adId });
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found');
  }
  if (ad.status === 'pending' || ad.status === 'blocked') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot change ad status');
  }
  ad.status = status;
  return ad.save();
};

/**
 * @param {ObjectId} adId
 * @returns {Promise}
 */
const removeAdById = async (userId, adId) => {
  const ad = await Ad.findOne({ userId, _id: adId });
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found');
  }
  fs.unlink(imgsFilePath(ad.mainImage), (err) => {
    if (err) throw err;
  });
  ad.subImages.forEach((filename) => {
    fs.unlink(imgsFilePath(filename), (err) => {
      if (err) throw err;
    });
  });
  await ad.deleteOne({ _id: adId });
};

/**
 * Get ads for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<ads>}
 */
const getAdminAds = async (filter, options) => {
  // Populate as comma-separated string (expected by paginate plugin)
  options.populate = 'userId,category';
  const ads = await Ad.paginate(filter, options);
  return ads;
};

/**
 *
 * @param {ObjectId} adId
 * @returns {Promise<Ad>}
 */
const getAdminAdById = async (adId) => {
  const ad = await Ad.findById(adId)
    .populate('userId', 'firstName lastName email phone addressLine1 addressLine2 city zipCode')
    .populate('category', 'name subCategories');
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found');
  }
  return ad;
};

/**
 * Change ad status
 * @param {ObjectId} adId
 * @returns {Promise<Ad>}
 */
const changeAdminAdStatus = async (adId, status) => {
  const ad = await Ad.findById(adId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ad not found');
  }
  ad.status = status;
  return ad.save();
};

// func for remove uploaded files if error occurs
const prepareUploadFiles = (files) => {
  const uploadedFiles = [];
  if (files.mainImg) {
    uploadedFiles.push(path.join('public/uploads/ad_images', files.mainImg[0].filename));
  }
  if (files.subImgs) {
    for (let i = 0; i < files.subImgs.length; i++) {
      uploadedFiles.push(path.join('public/uploads/ad_images', files.subImgs[i].filename));
    }
  }
  return uploadedFiles;
};

/**
 * Get file path
 * @param {string} filename
 * @returns {string}
 */
const imgsFilePath = (filename) => {
  return path.join('public/uploads/ad_images', filename);
};

module.exports = {
  createAd,
  getAds,
  getAdById,
  getUserAds,
  getUserAdById,
  editAdById,
  changeUserAdStatus,
  removeAdById,
  getAdminAds,
  getAdminAdById,
  changeAdminAdStatus,
};
