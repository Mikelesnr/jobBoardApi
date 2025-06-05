const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, minlength: 2 }, // Made optional for GitHub users but ensured minimum length
  username: { type: String, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  }, // Valid email format
  password: {
    type: String,
    required: function () {
      return this.userType !== "github";
    },
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "employer", "applicant", "github"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
