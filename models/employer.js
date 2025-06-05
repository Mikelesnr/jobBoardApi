const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true, trim: true, minlength: 2 }, // Enforces min length
  jobListings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Job",
    default: [],
  }, // Stores job IDs instead of raw strings
});

module.exports = mongoose.model("Employer", employerSchema);
