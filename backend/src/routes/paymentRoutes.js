const express = require('express');
const { createRazorpayOrder, verifyRazorpayPayment } = require('../service/razorPayment');

const router = express.Router();

// Create Order with UPI support
router.post('/api/create-razorpay-order', createRazorpayOrder);
router.post('/api/verify-razorpay-payment', verifyRazorpayPayment);

module.exports = router;