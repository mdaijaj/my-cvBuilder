const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload/profile', upload.single('profileImage'),(req, res) => {
    console.log('FILE:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'Upload successful',
      url: `/uploads/profile/${req.file.filename}`,
    });
  }
);

module.exports = router;