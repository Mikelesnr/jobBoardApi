const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const {
  authenticateUser,
  authorizeApplicant,
  authorizeEmployer,
} = require("../utilities/middleware");

/**
 * @swagger
 * tags:
 *   - name: Applications
 *     description: Routes for job applications and tracking
 */

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
 *           enum: ["Pending", "Under Review", "Interview Scheduled", "Accepted", "Rejected", "Withdrawn"]
 *           description: The current status of the application
 *           default: "Pending"
 *         appliedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the application was submitted
 *         feedback:
 *           type: string
 *           description: Employer feedback on the application (max 500 chars)
 *       example:
 *         applicantId: "6563b5a6b6cd5f0012a9a7f2"
 *         jobId: "6563b5a6b6cd5f0012a9a7f1"
 *         status: "Under Review"
 *         appliedAt: "2025-06-06T02:15:00Z"
 *         feedback: "Your skills match well with our role. We’ll reach out soon!"
 */

/**
 * @swagger
 * /applications/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 *     description: Allows authenticated applicants to apply for a job using the job ID.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job to apply for
 *                 example: "6563b5a6b6cd5f0012a9a7f1"
 *     responses:
 *       201:
 *         description: Job application submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Application submitted successfully!"
 *                 application:
 *                   $ref: "#/components/schemas/Application"
 *       400:
 *         description: Invalid request or missing required fields.
 *       404:
 *         description: Applicant profile not found.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/apply",
  authenticateUser,
  authorizeApplicant,
  applicationController.applyForJob
);

/**
 * @swagger
 * /applications/status/{jobId}:
 *   get:
 *     summary: Retrieve job application status
 *     tags: [Applications]
 *     description: Fetches the application status for the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID.
 *     responses:
 *       200:
 *         description: Successfully retrieved application status.
 *       404:
 *         description: No applications found.
 */
router.get(
  "/status/:jobId",
  authenticateUser,
  authorizeApplicant,
  applicationController.getApplicationStatus
);

/**
 * @swagger
 * /applications/user:
 *   get:
 *     summary: Retrieve applications submitted by a user
 *     tags: [Applications]
 *     description: Allows applicants to view their submitted job applications.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user applications.
 *       404:
 *         description: No applications found for user.
 */
router.get(
  "/user",
  authenticateUser,
  authorizeApplicant,
  applicationController.getUserApplications
);

/**
 * @swagger
 * /applications/job/{jobId}:
 *   get:
 *     summary: Retrieve applications for a specific job
 *     tags: [Applications]
 *     description: Allows employers to view job applications for their postings.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID.
 *     responses:
 *       200:
 *         description: Successfully retrieved job applications.
 *       404:
 *         description: No applications found for this job.
 */
router.get(
  "/job/:jobId",
  authenticateUser,
  authorizeEmployer,
  applicationController.getJobApplications
);

/**
 * @swagger
 * /applications/statusEmployer/:appId:
 *   put:
 *     summary: Update job application status
 *     tags: [Applications]
 *     description: Allows employers to update the status of a job application.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: appId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Under Review", "Interview Scheduled", "Accepted", "Rejected", "Withdrawn"]
 *                 example: "Accepted"
 *               feedback:
 *                 type: string
 *                 example: "Congratulations! You've been accepted for the role."
 *     responses:
 *       200:
 *         description: Successfully updated application status.
 *       400:
 *         description: Invalid request or missing required fields.
 */
router.put(
  "/statusEmployer/:appId",
  authenticateUser,
  authorizeEmployer,
  applicationController.updateApplicationStatus
);

module.exports = router;
