const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ad',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
favoriteSchema.plugin(toJSON);

// Create compound unique index to prevent duplicates
favoriteSchema.index({ userId: 1, adId: 1 }, { unique: true });

// Index for faster queries
favoriteSchema.index({ userId: 1, createdAt: -1 });

/**
 * @typedef Favorite
 */
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
