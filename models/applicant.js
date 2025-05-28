const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User
  resumeUrl: { type: String, required: true }, // Stores the latest resume
  skills: [String], // Allows listing multiple skills
  experience: [String], // Optional: Could store previous job roles
  education: [String], // Optional: Degrees, certifications
});

module.exports = mongoose.model("Applicant", applicantSchema);
