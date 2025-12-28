// Node.js/Express example
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  
  const options = {
    amount: amount * 100, 
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log(order);
    return res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const verifyRazorpayPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) 
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
}

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment
};