const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  }, // Links to Applicant
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }, // Links to Job Posting
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
  appliedAt: { type: Date, default: Date.now }, // Tracks when the application was submitted
  feedback: { type: String, default: "" }, // Employers can provide feedback
});

module.exports = mongoose.model("Application", applicationSchema);
