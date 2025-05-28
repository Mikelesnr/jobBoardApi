const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  jobListings: [String],
});

module.exports = mongoose.model("Employer", employerSchema);
