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
 * /jobs/create:
 *   post:
 *     summary: Create a new job listing
 *     tags: [Jobs]
 *     description: Allows authenticated employers to create job posts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/JobPost"
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.post(
  "/create",
  authenticateUser,
  authorizeEmployer,
  jobController.createJob
);

/**
 * @swagger
 * /jobs/{id}/edit:
 *   put:
 *     summary: Edit an existing job listing
 *     tags: [Jobs]
 *     description: Allows authenticated employers to edit job posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/JobPost"
 *     responses:
 *       200:
 *         description: Job edited successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.put(
  "/:id/edit",
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
 *     description: Allows authenticated employers or admins to delete job posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to delete
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       403:
 *         description: Unauthorized access
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
 *     description: Returns a list of all available job posts
 *     responses:
 *       200:
 *         description: Successfully retrieved job listings
 */
router.get("/", jobController.getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Retrieve a specific job listing by ID
 *     tags: [Jobs]
 *     description: Fetches detailed information about a single job posting
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved job details
 *       404:
 *         description: Job not found
 */
router.get("/:id", jobController.getJobById);

module.exports = router;
