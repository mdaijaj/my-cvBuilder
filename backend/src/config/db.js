const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
