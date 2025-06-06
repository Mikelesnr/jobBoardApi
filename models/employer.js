/**
 * @swagger
 * components:
 *   schemas:
 *     Employer:
 *       type: object
 *       required:
 *         - userId
 *         - companyName
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         userId:
 *           type: string
 *           description: Reference to the associated User
 *         companyName:
 *           type: string
 *           description: Name of the employer's company
 *         jobListings:
 *           type: array
 *           items:
 *             type: string
 *           description: List of job IDs associated with this employer
 *       example:
 *         _id: "6563b5a6b6cd5f0012a9a7f4"
 *         userId: "6563b5a6b6cd5f0012a9a7f1"
 *         companyName: "Tech Innovations Ltd."
 *         jobListings: ["6563b5a6b6cd5f0012a9a7f1", "6563b5a6b6cd5f0012a9a7f5"]
 */

const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true, trim: true, minlength: 2 },
  jobListings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Job",
    default: [],
  },
});

// Prevent model overwrite error
const Employer =
  mongoose.models.Employer || mongoose.model("Employer", employerSchema);

module.exports = Employer;
