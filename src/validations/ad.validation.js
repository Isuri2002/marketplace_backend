const Joi = require('joi');
const httpStatus = require('http-status');
const { objectId } = require('./custom.validation');
const ApiError = require('../utils/ApiError');

const validateMainImg = (req, res, next) => {
  try {
    // Check if mainImg is provided
    if (!req.files.mainImg || req.files.mainImg.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, `"${'mainImg'}" is required`);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const optionalText = Joi.string().allow('').optional();
const remoteRequiredText = Joi.string()
  .trim()
  .when('workingMode', {
    is: 'Remote',
    then: Joi.required(),
    otherwise: Joi.allow('').optional(),
  });
const onSiteOrHybridRequiredCoordinate = Joi.when('workingMode', {
  is: Joi.valid('Hybrid', 'Onsite'),
  then: Joi.alternatives().try(Joi.number(), Joi.string().trim().required()).required(),
  otherwise: Joi.alternatives().try(Joi.number(), Joi.string().allow('')).optional(),
});

const createAd = {
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      section: Joi.string().valid('rent', 'hire', 'buy').default('rent'),
      category: Joi.string().custom(objectId),
      subCategory: Joi.string().custom(objectId),
      rentFrequency: Joi.string()
        .valid('hourly', 'daily', 'weekly', 'monthly')
        .when('section', {
          is: Joi.valid('rent'),
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      priceType: Joi.string().valid('Fixed', 'Negotiable', 'Swap/Trade').required(),
      price: Joi.number().when('priceType', {
        is: Joi.valid('Fixed', 'Negotiable'),
        then: Joi.number().required(),
      }),
      hourlyRate: Joi.alternatives().try(Joi.number().min(0), Joi.string().allow('')).optional(),
      fixedProjectPrice: Joi.alternatives().try(Joi.number().min(0), Joi.string().allow('')).optional(),
      rentType: Joi.string().valid('offered', 'wanted').required(),
      isShipping: Joi.boolean().required(),
      // addOns: Joi.array().items(Joi.string()),
      totalAddonCharge: Joi.number().when('addOns', {
        is: Joi.exist(),
        then: Joi.number().required(),
      }),
      experienceLevel: optionalText,
      completedProjects: optionalText,
      languages: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
      skills: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
      features: Joi.alternatives()
        .try(
          Joi.array().items(
            Joi.alternatives().try(
              Joi.string(),
              Joi.object().keys({
                title: Joi.string().allow(''),
                description: Joi.string().allow(''),
                tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
              })
            )
          ),
          Joi.string()
        )
        .optional(),
      workingMode: Joi.string().valid('Remote', 'Hybrid', 'Onsite').optional(),
      availability: optionalText,
      serviceAtClientPlace: Joi.boolean().optional(),
      country: remoteRequiredText,
      timeZone: remoteRequiredText,
      workingHours: remoteRequiredText,
      city: optionalText,
      area: optionalText,
      coverageRadius: optionalText,
      address: optionalText,
      latitude: onSiteOrHybridRequiredCoordinate,
      longitude: onSiteOrHybridRequiredCoordinate,
      portfolioItems: Joi.alternatives().try(Joi.array().items(Joi.object()), Joi.string()).optional(),
      packages: Joi.alternatives().try(Joi.array().items(Joi.object()), Joi.string()).optional(),
      faqs: Joi.alternatives().try(Joi.array().items(Joi.object()), Joi.string()).optional(),
      // Business / Investment / Hire-specific fields
      yearEstablished: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
      platformType: Joi.string().optional(),
      platformFollowers: Joi.string().optional(),
      avgRevenueMonthly: Joi.number().min(0).optional(),
      avgProfitYearly: Joi.number().min(0).optional(),
      equityPercentage: Joi.number().min(0).max(100).optional(),
      status: Joi.forbidden(),
      createdDate: Joi.date().default(Date.now()),
    })
    .unknown(),
};

const editAd = {
  params: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      section: Joi.string().valid('rent', 'hire', 'buy').optional(),
      category: Joi.string().custom(objectId),
      subCategory: Joi.string().custom(objectId),
      rentFrequency: Joi.string()
        .valid('hourly', 'daily', 'monthly')
        .when('section', {
          is: Joi.valid('rent'),
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
      priceType: Joi.string().valid('Fixed', 'Negotiable', 'Swap/Trade').required(),
      price: Joi.number().when('priceType', {
        is: Joi.valid('Fixed', 'Negotiable'),
        then: Joi.number().required(),
      }),
      hourlyRate: Joi.alternatives().try(Joi.number().min(0), Joi.string().allow('')).optional(),
      fixedProjectPrice: Joi.alternatives().try(Joi.number().min(0), Joi.string().allow('')).optional(),
      rentType: Joi.string().valid('offered', 'wanted').required(),
      isShipping: Joi.boolean().required(),
      // addOns: Joi.array().items(Joi.string()),
      totalAddonCharge: Joi.number().when('addOns', {
        is: Joi.exist(),
        then: Joi.number().required(),
      }),
      experienceLevel: optionalText,
      completedProjects: optionalText,
      languages: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
      skills: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
      features: Joi.alternatives()
        .try(
          Joi.array().items(
            Joi.alternatives().try(
              Joi.string(),
              Joi.object().keys({
                title: Joi.string().allow(''),
                description: Joi.string().allow(''),
                tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
              })
            )
          ),
          Joi.string()
        )
        .optional(),
      workingMode: Joi.string().valid('Remote', 'Hybrid', 'Onsite').optional(),
      availability: optionalText,
      serviceAtClientPlace: Joi.boolean().optional(),
      country: remoteRequiredText,
      timeZone: remoteRequiredText,
      workingHours: remoteRequiredText,
      city: optionalText,
      area: optionalText,
      coverageRadius: optionalText,
      address: optionalText,
      latitude: onSiteOrHybridRequiredCoordinate,
      longitude: onSiteOrHybridRequiredCoordinate,
      portfolioItems: Joi.alternatives().try(Joi.array().items(Joi.object()), Joi.string()).optional(),
      packages: Joi.alternatives().try(Joi.array().items(Joi.object()), Joi.string()).optional(),
      faqs: Joi.alternatives().try(Joi.array().items(Joi.object()), Joi.string()).optional(),
      // Business / Investment / Hire-specific fields
      yearEstablished: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
      platformType: Joi.string().optional(),
      platformFollowers: Joi.string().optional(),
      avgRevenueMonthly: Joi.number().min(0).optional(),
      avgProfitYearly: Joi.number().min(0).optional(),
      equityPercentage: Joi.number().min(0).max(100).optional(),
    })
    .unknown(),
};

const adId = {
  params: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
  }),
};

const userStatusChange = {
  params: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('active', 'inactive').required(),
  }),
};

const adminStatusChange = {
  params: Joi.object().keys({
    adId: Joi.string().required().custom(objectId),
    status: Joi.string().valid('pending', 'active', 'blocked', 'inactive', 'expired').required(),
  }),
};

module.exports = {
  validateMainImg,
  createAd,
  editAd,
  adId,
  userStatusChange,
  adminStatusChange,
};
