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

/* #swagger.tags = ['Employers'] */
/* #swagger.description = 'Routes for employer profiles and job management' */

/* =========================== */
/* EMPLOYER ROUTES */
/* =========================== */

/* #swagger.tags = ['Employers']
   #swagger.description = 'Create an employer profile' */
router.post(
  "/profile",
  authenticateUser,
  authorizeEmployer,
  createEmployerProfile
);

/* #swagger.tags = ['Employers']
   #swagger.description = 'Retrieve an employer profile (Admin or Employer Only)' */
router.get(
  "/profile",
  authenticateUser,
  authorizeAdmin || authorizeEmployer,
  getEmployerProfile
);

/* #swagger.tags = ['Employers']
   #swagger.description = 'Update an employer profile (Admin or Employer Only)' */
router.put(
  "/profile",
  authenticateUser,
  authorizeAdmin || authorizeEmployer,
  updateEmployerProfile
);

/* =========================== */
/* JOB POSTING ROUTES (Employers Only) */
/* =========================== */

/* #swagger.tags = ['Employers']
   #swagger.description = 'Create a new job listing (Employers Only)' */
router.post("/jobs", authenticateUser, authorizeEmployer, postJob);

/* =========================== */
/* JOB APPLICATIONS ROUTES (Employers Only) */
/* =========================== */

/* #swagger.tags = ['Employers']
   #swagger.description = 'Retrieve applications for a specific job posting' */
router.get(
  "/jobs/:jobId/applications",
  authenticateUser,
  authorizeEmployer,
  getJobApplications
);

/* #swagger.tags = ['Employers']
   #swagger.description = 'Update the status of a job application' */
router.put(
  "/applications/:applicationId/status",
  authenticateUser,
  authorizeEmployer,
  updateApplicationStatus
);

module.exports = router;
