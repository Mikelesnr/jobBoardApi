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

// EMPLOYER ROUTES

router.post(
  "/profile",
  authenticateUser,
  authorizeEmployer,
  createEmployerProfile
);

router.get(
  "/profile",
  authenticateUser,
  authorizeAdmin || authorizeEmployer,
  getEmployerProfile
);

router.put(
  "/profile",
  authenticateUser,
  authorizeAdmin || authorizeEmployer,
  updateEmployerProfile
);

// JOB POSTING ROUTES (Employers Only)

router.post("/jobs", authenticateUser, authorizeEmployer, postJob);

// JOB APPLICATIONS ROUTES (Employers Only)

router.get(
  "/jobs/:jobId/applications",
  authenticateUser,
  authorizeEmployer,
  getJobApplications
);

router.put(
  "/applications/:applicationId/status",
  authenticateUser,
  authorizeEmployer,
  updateApplicationStatus
);

module.exports = router;
