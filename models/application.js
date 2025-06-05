const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: {
    type: String,
    enum: [
      "Pending",
      "Under Review",
      "Interview Scheduled",
      "Accepted",
      "Rejected",
      "Withdrawn",
    ],
    default: "Pending",
  },
  appliedAt: { type: Date, default: Date.now },
  feedback: { type: String, trim: true, maxlength: 500 }, // Limits feedback to 500 characters
});

module.exports = mongoose.model("Application", applicationSchema);
