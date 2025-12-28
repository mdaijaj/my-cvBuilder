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
  origin: process.env.REACT_APP_FRONTEND_URL,
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