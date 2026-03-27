const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFeaturedCategory = {
  body: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
    image: Joi.string().optional(),
  }),
};

const getFeaturedCategories = {
  query: Joi.object().keys({
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFeaturedCategory = {
  params: Joi.object().keys({
    featuredCategoryId: Joi.string().custom(objectId),
  }),
};

const updateFeaturedCategory = {
  body: Joi.object()
    .keys({
      id: Joi.string().custom(objectId).required(),
      image: Joi.string().optional(),
      displayOrder: Joi.number().integer(),
      isActive: Joi.boolean(),
    })
    .min(2),
};

const deleteFeaturedCategory = {
  params: Joi.object().keys({
    featuredCategoryId: Joi.string().custom(objectId),
  }),
};

const reorderFeaturedCategories = {
  body: Joi.object().keys({
    orderArray: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string().custom(objectId).required(),
          displayOrder: Joi.number().integer().required(),
        })
      )
      .required(),
  }),
};

module.exports = {
  createFeaturedCategory,
  getFeaturedCategories,
  getFeaturedCategory,
  updateFeaturedCategory,
  deleteFeaturedCategory,
  reorderFeaturedCategories,
};
