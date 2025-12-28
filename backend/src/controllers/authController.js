const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');


const register = asyncHandler(async (req, res) => {
  const { username, email, password, contact } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).send({message: "user allready exits"})
  }

  const user = await User.create({ username, email, password, contact });
  console.log("user", user)

  const token=generateToken(user._id)
  console.log("token", token)

  if (user) {
    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      contact: user.contact
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  const token=generateToken(user._id)
  console.log("token", token)

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      contact: user.contact,
      token: token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


const getProfile = asyncHandler(async (req, res) => {
  console.log(req.file)
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      contact: user.contact,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// Google Login Controller
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    if (!credential) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credential is required' 
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
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
};

module.exports = { register, login, getProfile, googleLogin };