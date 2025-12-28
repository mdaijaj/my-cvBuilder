// const crypto = require('crypto');

// const router = express.Router();


// router.post('/api/verify-razorpay-payment', (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
//   const body = razorpay_order_id + '|' + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac('sha256', 'aijajkhan')
//     .update(body.toString())
//     .digest('hex');

//   if (expectedSignature === razorpay_signature) {
//     res.json({ success: true });
//   } else {
//     res.json({ success: false });
//   }
// });
