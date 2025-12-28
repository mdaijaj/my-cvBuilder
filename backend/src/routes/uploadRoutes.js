const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
const app = express();
app.use(express.json());

router.post('/upload/profile', (req, res) => {
  // call multer manually so we can capture multer errors and respond cleanly
  upload.single('profileImage')(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message || 'Upload error' });
    }

    console.log('FILE:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'Upload successful',
      url: `/uploads/profile/${req.file.filename}`,
    });
  });
});

module.exports = router;


