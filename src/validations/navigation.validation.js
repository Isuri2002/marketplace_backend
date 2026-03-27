const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNavigation = {
  body: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
    section: Joi.string().valid('rent', 'hire', 'buy'),
  }),
};

const getNavigations = {
  query: Joi.object().keys({
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNavigation = {
  params: Joi.object().keys({
    navigationId: Joi.string().custom(objectId),
  }),
};

const updateNavigation = {
  params: Joi.object().keys({
    navigationId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      displayOrder: Joi.number().integer(),
      isActive: Joi.boolean(),
      addSection: Joi.string().valid('rent', 'hire', 'buy'),
      removeSection: Joi.string().valid('rent', 'hire', 'buy'),
      sections: Joi.array().items(Joi.string().valid('rent', 'hire', 'buy')),
    })
    .min(1),
};

const deleteNavigation = {
  params: Joi.object().keys({
    navigationId: Joi.string().custom(objectId),
  }),
};

const reorderNavigations = {
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
  createNavigation,
  getNavigations,
  getNavigation,
  updateNavigation,
  deleteNavigation,
  reorderNavigations,
};
