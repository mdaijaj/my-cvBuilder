const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadProfile } = require('../controllers/uploadController');
const { createRazorpayOrder, verifyRazorpayPayment } = require('../service/razorPayment');

const router = express.Router();
const app = express();
app.use(express.json());

router.post('/upload/profile', protect, uploadProfile);


//payment routes
router.post('/api/create-razorpay-order', createRazorpayOrder);
router.post('/api/verify-razorpay-payment', verifyRazorpayPayment);

module.exports = router;


