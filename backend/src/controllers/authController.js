const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');


const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).send({message: "user allready exits"})
  }

  const user = await User.create({ name, email, password });

  const token=generateToken(user._id)
  console.log("token", token)

  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
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
      name: user.name,
      email: user.email,
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
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { register, login, getProfile };