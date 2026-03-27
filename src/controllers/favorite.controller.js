const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { favoriteService } = require('../services');
const pick = require('../utils/pick');

const addFavorite = catchAsync(async (req, res) => {
  const result = await favoriteService.addFavorite(req.user.id, req.params.adId);
  console.log(`favorites: user ${req.user.id} add ad ${req.params.adId} -> created=${result.created}`);
  if (result.created) {
    return res.status(httpStatus.CREATED).send({ favorite: result.favorite, message: 'Added to favorites' });
  }
  return res.status(httpStatus.OK).send({ favorite: result.favorite, message: 'Already in favorites' });
});

const removeFavorite = catchAsync(async (req, res) => {
  const favorite = await favoriteService.removeFavorite(req.user.id, req.params.adId);
  console.log(`favorites: user ${req.user.id} remove ad ${req.params.adId} -> removed=${!!favorite}`);
  if (!favorite) {
    return res.status(httpStatus.OK).send({ message: 'Favorite not found' });
  }
  return res.status(httpStatus.OK).send({ message: 'Removed from favorites' });
});

const getUserFavorites = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const favorites = await favoriteService.getUserFavorites(req.user.id, options);
  res.status(httpStatus.OK).send({ results: favorites, count: favorites.length });
});

const checkFavorite = catchAsync(async (req, res) => {
  const isFavorite = await favoriteService.isFavorite(req.user.id, req.params.adId);
  res.status(httpStatus.OK).send({ isFavorite });
});

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
};
