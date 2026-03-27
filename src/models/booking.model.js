const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const bookingSchema = new mongoose.Schema(
  {
    adId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Ad',
      required: true,
    },
    renterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
    priceSnapshot: {
      type: Number,
      required: true,
    },
    rentFrequencySnapshot: {
      type: String,
      required: true,
    },
    currencySnapshot: {
      type: String,
      default: 'AUD',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ adId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ renterId: 1, createdAt: -1 });

bookingSchema.plugin(toJSON);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
