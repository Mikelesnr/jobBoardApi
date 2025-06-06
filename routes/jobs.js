const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const {
  authenticateUser,
  authorizeEmployer,
  authorizeAdmin,
} = require("../utilities/middleware");

/**
 * @swagger
 * tags:
 *   - name: Jobs
 *     description: Job postings and management
 */

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

/**
 * @swagger
 * /jobs/create:
 *   post:
 *     summary: Create a new job listing
 *     tags: [Jobs]
 *     description: Allows authenticated employers to create job posts.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Job"
 *           example:
 *             title: "Frontend Developer"
 *             description: "Seeking a React expert with UI/UX experience"
 *             salary: 85000
 *             location: "San Francisco, CA"
 *             employer: "6563b5a6b6cd5f0012a9a7f4"
 *             companyImage: "https://example.com/logo.png"
 *     responses:
 *       201:
 *         description: Job created successfully.
 *       400:
 *         description: Invalid request or missing required fields.
 */
router.post(
  "/create",
  authenticateUser,
  authorizeEmployer,
  jobController.createJob
);

/**
 * @swagger
 * /jobs/edit/{id}:
 *   put:
 *     summary: Edit an existing job listing
 *     tags: [Jobs]
 *     description: Allows authenticated employers to edit job posts.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to edit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Job"
 *           example:
 *             title: "Updated Frontend Developer Role"
 *             description: "Updated job description with new requirements"
 *             salary: 90000
 *             location: "Remote"
 *     responses:
 *       200:
 *         description: Job edited successfully.
 *       400:
 *         description: Invalid request or missing required fields.
 */
router.put(
  "/edit/:id",
  authenticateUser,
  authorizeEmployer,
  jobController.editJob
);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job listing
 *     tags: [Jobs]
 *     description: Allows authenticated employers or admins to delete job posts.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to delete.
 *     responses:
 *       200:
 *         description: Job deleted successfully.
 *       403:
 *         description: Unauthorized access.
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeEmployer,
  jobController.deleteJob
);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Retrieve all job listings
 *     tags: [Jobs]
 *     description: Returns a list of all available job posts.
 *     responses:
 *       200:
 *         description: Successfully retrieved job listings.
 */
router.get("/", jobController.getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Retrieve a specific job listing by ID
 *     tags: [Jobs]
 *     description: Fetches detailed information about a single job posting.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved job details.
 *       404:
 *         description: Job not found.
 */
router.get("/:id", jobController.getJobById);

module.exports = router;
