const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "employer", "applicant"], // Restricts allowed values
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Additional fields for employers
  companyName: {
    type: String,
    required: function () {
      return this.userType === "employer"; // Only required for employers
    },
  },

  // Additional fields for applicants
  resume: {
    type: String, // Could store a file path or URL
    required: function () {
      return this.userType === "applicant"; // Only required for applicants
    },
  },
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
