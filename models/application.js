/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - applicantId
 *         - jobId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         applicantId:
 *           type: string
 *           description: Reference to the Applicant who submitted the application
 *         jobId:
 *           type: string
 *           description: Reference to the Job being applied for
 *         status:
 *           type: string
 *           enum:
 *             - Pending
 *             - Under Review
 *             - Interview Scheduled
 *             - Accepted
 *             - Rejected
 *             - Withdrawn
 *           description: The current status of the application
 *           default: Pending
 *         appliedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the application was submitted
 *         feedback:
 *           type: string
 *           description: Employer feedback on the application (max 500 chars)
 *       example:
 *         _id: "6563b5a6b6cd5f0012a9a7f3"
 *         applicantId: "6563b5a6b6cd5f0012a9a7f2"
 *         jobId: "6563b5a6b6cd5f0012a9a7f1"
 *         status: "Under Review"
 *         appliedAt: "2025-06-06T02:15:00Z"
 *         feedback: "Your skills match well with our role. We’ll reach out soon!"
 */

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
