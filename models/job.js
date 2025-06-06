/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - salary
 *         - location
 *         - employer
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         title:
 *           type: string
 *           description: Job title (min 3 characters)
 *         description:
 *           type: string
 *           description: Detailed job description (min 10 characters)
 *         salary:
 *           type: number
 *           description: Salary in USD (must be non-negative)
 *           minimum: 0
 *         location:
 *           type: string
 *           description: Job location
 *         employer:
 *           type: string
 *           description: Reference to the employer (User model)
 *         companyImage:
 *           type: string
 *           format: uri
 *           description: Company logo URL (must be a valid image format)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of job creation
 *       example:
 *         _id: "6563b5a6b6cd5f0012a9a7f6"
 *         title: "Frontend Developer"
 *         description: "We need an expert in React and UI/UX design"
 *         salary: 85000
 *         location: "San Francisco, CA"
 *         employer: "6563b5a6b6cd5f0012a9a7f4"
 *         companyImage: "https://example.com/logo.png"
 *         createdAt: "2025-06-06T02:30:00Z"
 */

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, required: true, trim: true, minlength: 10 },
  salary: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyImage: {
    type: String,
    match: /^https?:\/\/.*\.(jpeg|jpg|png|gif)$/i,
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite error
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

module.exports = Job;
