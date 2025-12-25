const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  MONGO_URI="mongodb://localhost:27017/cv_builder"

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
