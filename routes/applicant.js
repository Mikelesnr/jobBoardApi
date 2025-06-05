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
  authorizeEmployer,
} = require("../utilities/middleware");

/* =========================== */
/* APPLICANT ROUTES */
/* =========================== */

router.post(
  "/profile",
  authenticateUser,
  authorizeApplicant,
  createApplicantProfile
);

router.get("/profile", authenticateUser, authorizeAdmin, getApplicantProfile);

router.get(
  "/profile/:id",
  authenticateUser,
  authorizeApplicant || authorizeAdmin || authorizeEmployer,
  getApplicantProfile
);

router.put(
  "/profile",
  authenticateUser,
  authorizeApplicant || authorizeAdmin,
  updateApplicantProfile
);

module.exports = router;
