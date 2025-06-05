const express = require("express");
const router = express.Router();
const {
  createEmployerProfile,
  getEmployerProfile,
  updateEmployerProfile,
  postJob,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/employerController");

const {
  authenticateUser,
  authorizeEmployer,
  authorizeAdmin,
} = require("../utilities/middleware");

/**
 * @swagger
 * tags:
 *   - name: Employers
 *     description: Routes for employer profiles and job management
 */

/**
 * @swagger
 * /employers/profile:
 *   post:
 *     summary: Create an employer profile
 *     tags: [Employers]
 *     description: Allows authenticated employers to create their profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Employer profile created successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.post(
  "/profile",
  authenticateUser,
  authorizeEmployer,
  createEmployerProfile
);

/**
 * @swagger
 * /employers/profile:
 *   get:
 *     summary: Retrieve employer profile
 *     tags: [Employers]
 *     description: Allows authenticated employers or admins to view an employer profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved employer profile
 *       404:
 *         description: Employer profile not found
 */
router.get(
  "/profile",
  authenticateUser,
  (req, res, next) => {
    // Allow admins or employers to access this route
    if (authorizeAdmin(req, res, next) || authorizeEmployer(req, res, next)) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  },
  getEmployerProfile
);

/**
 * @swagger
 * /employers/profile:
 *   put:
 *     summary: Update employer profile
 *     tags: [Employers]
 *     description: Allows authenticated employers or admins to update their profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Employer profile updated successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.put(
  "/profile",
  authenticateUser,
  (req, res, next) => {
    // Allow employers or admins to update profiles
    if (authorizeAdmin(req, res, next) || authorizeEmployer(req, res, next)) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  },
  updateEmployerProfile
);

/* =========================== */
/* JOB POSTING ROUTES (Employers Only) */
/* =========================== */

/**
 * @swagger
 * /employers/jobs:
 *   post:
 *     summary: Create a new job listing
 *     tags: [Employers]
 *     description: Allows authenticated employers to create a job post
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Job listing created successfully
 *       400:
 *         description: Invalid request or missing required fields
 */
router.post("/jobs", authenticateUser, authorizeEmployer, postJob);

/* =========================== */
/* JOB APPLICATIONS ROUTES (Employers Only) */
/* =========================== */

/**
 * @swagger
 * /employers/jobs/{jobId}/applications:
 *   get:
 *     summary: Retrieve applications for a specific job posting
 *     tags: [Employers]
 *     description: Allows authenticated employers to view applications for their jobs
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
  "/jobs/:jobId/applications",
  authenticateUser,
  authorizeEmployer,
  getJobApplications
);

/**
 * @swagger
 * /employers/applications/{applicationId}/status:
 *   put:
 *     summary: Update job application status
 *     tags: [Employers]
 *     description: Allows authenticated employers to update the status of job applications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: applicationId
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
  "/applications/:applicationId/status",
  authenticateUser,
  authorizeEmployer,
  updateApplicationStatus
);

module.exports = router;
