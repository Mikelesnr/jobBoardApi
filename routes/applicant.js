const express = require("express");
const router = express.Router();
const {
  createApplicantProfile,
  getApplicantProfile,
  updateApplicantProfile,
} = require("../controllers/applicantController");
const {
  authenticateUser,
  authorizeApplicant,
  authorizeAdmin,
} = require("../utilities/middleware");

/* =========================== */
/* APPLICANT ROUTES */
/* =========================== */

// Authenticate all routes first, then authorize appropriately
router.post(
  "/profile",
  authenticateUser,
  authorizeApplicant,
  createApplicantProfile
);
router.get(
  "/profile",
  authenticateUser,
  authorizeApplicant || authorizeAdmin,
  getApplicantProfile
);
router.put(
  "/profile",
  authenticateUser,
  authorizeApplicant || authorizeAdmin,
  updateApplicantProfile
);

module.exports = router;
