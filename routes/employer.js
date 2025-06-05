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

/* =========================== */
/* EMPLOYER ROUTES */
/* =========================== */

// Create employer profile (Employers Only)
router.post(
  "/profile",
  authenticateUser,
  authorizeEmployer,
  createEmployerProfile
);

// Get employer profile (Admin or Employer)
router.get(
  "/profile",
  authenticateUser,
  authorizeAdmin || authorizeEmployer,
  getEmployerProfile
);

// Update employer profile (Admin or Employer)
router.put(
  "/profile",
  authenticateUser,
  authorizeAdmin || authorizeEmployer,
  updateEmployerProfile
);

// Post job listing (Employers Only)
router.post("/jobs", authenticateUser, authorizeEmployer, postJob);

// Get job applications (Employers Only)
router.get(
  "/jobs/:jobId/applications",
  authenticateUser,
  authorizeEmployer,
  getJobApplications
);

// Update application status (Employers Only)
router.put(
  "/applications/:applicationId/status",
  authenticateUser,
  authorizeEmployer,
  updateApplicationStatus
);

module.exports = router;
