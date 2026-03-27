const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bookingValidation = require('../../validations/booking.validation');
const bookingController = require('../../controllers/booking.controller');

const router = express.Router();

router.post('/', auth(), validate(bookingValidation.createBooking), bookingController.createBooking);
router.get('/check-review/:adId', auth(), bookingController.checkReviewEligibility);
router.get('/:bookingId', auth(), validate(bookingValidation.bookingId), bookingController.getBooking);

module.exports = router;
