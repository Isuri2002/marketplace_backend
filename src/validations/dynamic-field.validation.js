const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDynamicField = {
  body: Joi.object().keys({
    categoryId: Joi.string().required().custom(objectId),
    fields: Joi.array().required(),
  }),
};

const getDynamicFields = {
  query: Joi.object().keys({
    categoryIds: Joi.alternatives().try(
      Joi.string().custom(objectId),
      Joi.array().items(Joi.string().custom(objectId))
    ),
  }),
};

const editDynamicField = {
  body: Joi.object().keys({
    dynamicFieldId: Joi.string().custom(objectId),
    label: Joi.string().required(),
    type: Joi.string().required(),
    options: Joi.array(),
    placeholder: Joi.string(),
  }),
};

const deleteDynamicField = {
  params: Joi.object().keys({
    dynamicFieldId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDynamicField,
  getDynamicFields,
  editDynamicField,
  deleteDynamicField,
};
