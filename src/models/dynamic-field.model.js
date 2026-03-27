const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const dynamicFieldSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    trim: true,
  },
  label: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    trim: true,
    enum: ['select', 'text', 'number', 'textarea', 'radio', 'checkbox'],
    required: true,
  },
  options: {
    type: [String],
    trim: true,
  },
  placeholder: {
    type: String,
    trim: true,
  },
});

dynamicFieldSchema.plugin(toJSON);

const CategoryDynamicField = mongoose.model('CategoryDynamicField', dynamicFieldSchema);

module.exports = CategoryDynamicField;
