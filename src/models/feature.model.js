const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  iconStr: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending',
  },
});

featureSchema.plugin(toJSON);
featureSchema.plugin(paginate);

const Feature = mongoose.model('Feature', featureSchema);

module.exports = Feature;
