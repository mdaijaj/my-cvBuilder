const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadProfile } = require('../controllers/uploadController');
const { createRazorpayOrder, verifyRazorpayPayment } = require('../service/razorPayment');

const router = express.Router();

router.post('/upload/profile', protect, uploadProfile);

// Payment routes - remove /api/ prefix
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-razorpay-payment', verifyRazorpayPayment);

module.exports = router;