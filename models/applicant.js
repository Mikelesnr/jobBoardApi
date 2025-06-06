/**
 * @swagger
 * components:
 *   schemas:
 *     Applicant:
 *       type: object
 *       required:
 *         - userId
 *         - resumeUrl
 *         - skills
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         userId:
 *           type: string
 *           description: Reference to the associated User
 *         resumeUrl:
 *           type: string
 *           format: uri
 *           description: Link to applicant's resume
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: List of skills
 *         experience:
 *           type: array
 *           items:
 *             type: string
 *           description: Previous work experience
 *         education:
 *           type: array
 *           items:
 *             type: string
 *           description: Educational background
 *       example:
 *         _id: "6563b5a6b6cd5f0012a9a7f2"
 *         userId: "6563b5a6b6cd5f0012a9a7f1"
 *         resumeUrl: "https://example.com/resume.pdf"
 *         skills: ["JavaScript", "Node.js", "MongoDB"]
 *         experience: ["Software Engineer at XYZ", "Intern at ABC"]
 *         education: ["Bachelor's in Computer Science"]
 */

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
