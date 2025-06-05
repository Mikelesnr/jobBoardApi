const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const {
  authenticateUser,
  authorizeApplicant,
  authorizeEmployer,
} = require("../utilities/middleware");

/* #swagger.tags = ['Applications'] */
/* #swagger.description = 'Routes for job applications and tracking' */

/* =========================== */
/* APPLY FOR A JOB (Applicants & GitHub Users) */
/* =========================== */
/* #swagger.tags = ['Applications']
   #swagger.description = 'Apply for a job by providing the Job ID' */
router.post(
  "/apply/:jobId",
  authenticateUser,
  authorizeApplicant,
  applicationController.applyForJob
);

/* =========================== */
/* GET APPLICATION STATUS (Applicants & GitHub Users) */
/* =========================== */
/* #swagger.tags = ['Applications']
   #swagger.description = 'Retrieve the status of job applications' */
router.get(
  "/status",
  authenticateUser,
  authorizeApplicant,
  applicationController.getApplicationStatus
);

/* =========================== */
/* GET USER APPLICATIONS (Applicants & GitHub Users) */
/* =========================== */
/* #swagger.tags = ['Applications']
   #swagger.description = 'Retrieve job applications submitted by the user' */
router.get(
  "/user/applications",
  authenticateUser,
  authorizeApplicant,
  applicationController.getUserApplications
);

/* =========================== */
/* GET APPLICATIONS FOR A JOB (Employers Only) */
/* =========================== */
/* #swagger.tags = ['Applications']
   #swagger.description = 'Retrieve job applications for a specific job posting' */
router.get(
  "/job/:jobId/applications",
  authenticateUser,
  authorizeEmployer,
  applicationController.getJobApplications
);

/* =========================== */
/* UPDATE APPLICATION STATUS (Employers Only) */
/* =========================== */
/* #swagger.tags = ['Applications']
   #swagger.description = 'Update the status of a job application' */
router.put(
  "/application/:appId/status",
  authenticateUser,
  authorizeEmployer,
  applicationController.updateApplicationStatus
);

module.exports = router;
