const asyncHandler = require('express-async-handler');
const User = require('../models/User');
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

module.exports = { register, login, getProfile };