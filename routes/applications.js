const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const {
  authenticateUser,
  authorizeApplicant,
  authorizeEmployer,
} = require("../utilities/middleware");

/* =========================== */
/* APPLY FOR A JOB (Applicants & GitHub Users) */
/* =========================== */
router.post(
  "/apply/:jobId",
  authenticateUser,
  authorizeApplicant,
  applicationController.applyForJob
);

/* =========================== */
/* GET APPLICATION STATUS (Applicants & GitHub Users) */
/* =========================== */
router.get(
  "/status",
  authenticateUser,
  authorizeApplicant,
  applicationController.getApplicationStatus
);

/* =========================== */
/* GET USER APPLICATIONS (Applicants & GitHub Users) */
/* =========================== */
router.get(
  "/user/applications",
  authenticateUser,
  authorizeApplicant,
  applicationController.getUserApplications
);

/* =========================== */
/* GET APPLICATIONS FOR A JOB (Employers Only) */
/* =========================== */
router.get(
  "/job/:jobId/applications",
  authenticateUser,
  authorizeEmployer,
  applicationController.getJobApplications
);

/* =========================== */
/* UPDATE APPLICATION STATUS (Employers Only) */
/* =========================== */
router.put(
  "/application/:appId/status",
  authenticateUser,
  authorizeEmployer,
  applicationController.updateApplicationStatus
);

module.exports = router;
