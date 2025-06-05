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
 * /applications/apply/{jobId}:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 *     description: Allows authenticated applicants to apply for a job using the job ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to apply for
 *     responses:
 *       201:
 *         description: Job application submitted successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.post(
  "/apply/:jobId",
  authenticateUser,
  authorizeApplicant,
  applicationController.applyForJob
);

/**
 * @swagger
 * /applications/status:
 *   get:
 *     summary: Retrieve job application status
 *     tags: [Applications]
 *     description: Fetches the application status for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved application status
 *       404:
 *         description: No applications found
 */
router.get(
  "/status",
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
 *     description: Allows applicants to view their submitted job applications
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user applications
 *       404:
 *         description: No applications found for user
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
 *     description: Allows employers to view job applications for their postings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Successfully retrieved job applications
 *       404:
 *         description: No applications found for this job
 */
router.get(
  "/job/:jobId",
  authenticateUser,
  authorizeEmployer,
  applicationController.getJobApplications
);

/**
 * @swagger
 * /applications/{appId}/status:
 *   put:
 *     summary: Update job application status
 *     tags: [Applications]
 *     description: Allows employers to update the status of a job application
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: appId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Successfully updated application status
 *       400:
 *         description: Invalid request or missing required fields
 */
router.put(
  "/:appId/status",
  authenticateUser,
  authorizeEmployer,
  applicationController.updateApplicationStatus
);

module.exports = router;
