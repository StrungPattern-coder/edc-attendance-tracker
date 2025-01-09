const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use environment variable or fallback
    const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://username:YUTXa5134pexmQdv@cluster.mongodb.net/dbname";

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;