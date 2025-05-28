const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
console.log(applicationController.getJobApplications);

const {
  authenticateUser,
  authorizeEmployer,
} = require("../middleware/authMiddleware");

/* ===========================
 * APPLY FOR A JOB (Applicants Only)
 * =========================== */
router.post(
  "/apply/:jobId",
  authenticateUser,
  applicationController.applyForJob
);

/* ===========================
 * GET APPLICATIONS FOR A JOB (Employers Only)
 * =========================== */
router.get(
  "/job/:jobId/applications",
  authenticateUser,
  authorizeEmployer,
  applicationController.getJobApplications
);

/* ===========================
 * UPDATE APPLICATION STATUS (Employers Only)
 * =========================== */
router.put(
  "/application/:appId/status",
  authenticateUser,
  authorizeEmployer,
  applicationController.updateApplicationStatus
);

/* ===========================
 * GET USER APPLICATIONS (Applicants Only)
 * =========================== */
router.get(
  "/user/:userId/applications",
  authenticateUser,
  applicationController.getUserApplications
);

module.exports = router;
