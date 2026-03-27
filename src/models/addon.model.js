const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const addonsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

addonsSchema.plugin(toJSON);

const Addons = mongoose.model('Addons', addonsSchema);

module.exports = Addons;
