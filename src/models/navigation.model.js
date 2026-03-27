const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const navigationSchema = mongoose.Schema(
  {
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
      required: true,
      unique: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Optional per-section activation. If absent, navigation is considered global (appears in all sections).
    sections: {
      type: [String],
      enum: ['rent', 'hire', 'buy'],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
navigationSchema.plugin(toJSON);
navigationSchema.plugin(paginate);

/**
 * @typedef Navigation
 */
const Navigation = mongoose.model('Navigation', navigationSchema);

module.exports = Navigation;
