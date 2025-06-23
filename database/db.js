const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/role_auth_crud",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database error:", err);
    process.exit(1); // Exit process with failure
  }
};
module.exports = connectDB;
