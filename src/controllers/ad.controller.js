const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { adService } = require("../services");
const pick = require("../utils/pick");

const createAd = catchAsync(async (req, res) => {
  const ad = await adService.createAd(req.user.id, req.files, req.body);
  res.status(httpStatus.CREATED).send(ad);
});

const getAds = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "title",
    "category",
    "subCategory",
    "section",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  // Check if the 'similarTitle' parameter is passed in the query
  if (req.query.similarTitle) {
    filter.title = { $regex: req.query.similarTitle, $options: "i" };
  }
  const ads = await adService.getAds(filter, options);
  res.status(httpStatus.OK).send(ads);
});

const getAd = catchAsync(async (req, res) => {
  const ad = await adService.getAdById(req.params.adId, {
    populate: req.query.populate,
  });
  res.status(httpStatus.OK).send(ad);
});

const getUserAds = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "title",
    "category",
    "subCategory",
    "section",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const ads = await adService.getUserAds(req.user.id, filter, options);
  res.status(httpStatus.OK).send(ads);
});

const getUserAd = catchAsync(async (req, res) => {
  const ad = await adService.getUserAdById(req.user.id, req.params.adId);
  res.status(httpStatus.OK).send(ad);
});

const editAd = catchAsync(async (req, res) => {
  const ad = await adService.editAdById(
    req.user.id,
    req.params.adId,
    req.files,
    req.body,
  );
  res.status(httpStatus.OK).send(ad);
});

const changeUserAdStatus = catchAsync(async (req, res) => {
  const ad = await adService.changeUserAdStatus(
    req.user.id,
    req.params.adId,
    req.body.status,
  );
  res.status(httpStatus.OK).send(ad);
});

const removeAd = catchAsync(async (req, res) => {
  const ad = await adService.removeAdById(req.user.id, req.params.adId);
  res.status(httpStatus.OK).send(ad);
});

const getAdminAds = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "title",
    "category",
    "subCategory",
    "section",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const ads = await adService.getAdminAds(filter, options);
  res.status(httpStatus.OK).send(ads);
});

const getAdminAd = catchAsync(async (req, res) => {
  const ad = await adService.getAdminAdById(req.params.adId);
  res.status(httpStatus.OK).send(ad);
});

const changeAdminAdStatus = catchAsync(async (req, res) => {
  const ad = await adService.changeAdminAdStatus(
    req.params.adId,
    req.params.status,
  );
  res.status(httpStatus.OK).send(ad);
});

module.exports = {
  createAd,
  getAds,
  getAd,
  getUserAds,
  getUserAd,
  editAd,
  changeUserAdStatus,
  removeAd,
  getAdminAds,
  getAdminAd,
  changeAdminAdStatus,
};
