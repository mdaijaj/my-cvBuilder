const express = require('express');
const { register, login, getProfile, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile',  getProfile);   //temp protect


router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const client = new OAuth2Client("255109659141-vk37qhedo169gak58v5f5bvd31emon17.apps.googleusercontent.com");

    if (!credential) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credential is required' 
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: "255109659141-vk37qhedo169gak58v5f5bvd31emon17.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    console.log('Google payload received:', payload);
    const { email, name, picture, sub: googleId } = payload;

    console.log('Google payload:', { email, name, googleId });

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        username: name,
        email: email,
        googleId: googleId,
        isVerified: true,
        authProvider: 'google',
      });
      console.log('New user created:', user._id);
    } else {
      // Update existing user with Google info
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        user.isVerified = true;
        await user.save();
        console.log('User updated with Google info:', user._id);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message,
    });
  }
});

module.exports = router;