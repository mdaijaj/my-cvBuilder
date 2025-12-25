const jwt = require('jsonwebtoken');
require("dotenv").config();


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "aijajkhan", {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;