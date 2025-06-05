const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, minlength: 2 },
  username: { type: String, unique: true, trim: true, sparse: true }, // Added sparse to allow null but unique for non-null
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: function () {
      return this.userType !== "github";
    },
  },
  githubId: {
    // THIS IS THE NEW FIELD YOU NEED TO ADD
    type: String,
    unique: true,
    sparse: true, // Allows null values, but unique for non-null githubId
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "employer", "applicant", "github"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
