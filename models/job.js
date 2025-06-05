const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, required: true, trim: true, minlength: 10 }, // Ensures description isn't too short
  salary: { type: Number, required: true, min: 0 }, // Ensures non-negative salary
  location: { type: String, required: true, trim: true },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyImage: {
    type: String,
    match: /^https?:\/\/.*\.(jpeg|jpg|png|gif)$/i, // Validates image URLs
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
