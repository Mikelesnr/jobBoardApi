const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeUrl: {
    type: String,
    required: true,
    trim: true,
    match: /^https?:\/\/.*$/,
  }, // Ensures valid URL format
  skills: { type: [String], validate: (v) => Array.isArray(v) && v.length > 0 }, // Requires at least one skill
  experience: { type: [String], default: [] },
  education: { type: [String], default: [] },
});

module.exports = mongoose.model("Applicant", applicantSchema);
