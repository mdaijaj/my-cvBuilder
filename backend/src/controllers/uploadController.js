const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'resume-builder',
      resource_type: 'image',
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Image upload failed');
  }
});

module.exports = { uploadImage };