const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
require("dotenv").config();
const path = require("path")
const fs = require('fs');
dotenv.config();
const crypto = require('crypto');


// Connect to database
connectDB();

// Add this near the top of your server file
const uploadsDir = path.join(__dirname, 'uploads/profile');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Node.js/Express example
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_Rwsplfx5C62L66',
  key_secret: '16ZFYKpxrT5DJ26pPn2V6HWQ'
});

app.post('/api/create-razorpay-order', async (req, res) => {
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
});


app.post('/api/verify-razorpay-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', '16ZFYKpxrT5DJ26pPn2V6HWQ') // Use your key_secret, not 'aijajkhan'
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});