const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const jobRoutes = require("./jobs");
const applicationRoutes = require("./applications");
const employerRoutes = require("./employer");
const applicantRoutes = require("./applicant");
const welcomeController = require("../controllers/welcomeController");

/* ===========================
 * USER ROUTES (Authentication & Profile Management)
 * =========================== */
router.use("/auth", authRoutes);

/* ===========================
 * JOB ROUTES (Job Listings & Management)
 * =========================== */
router.use("/jobs", jobRoutes);

/* ===========================
 * APPLICANT ROUTES (Applicant Profiles & Management)
 * =========================== */
router.use("/applicants", applicantRoutes);

/* ===========================
 * EMPLOYER ROUTES (Employer Profiles & Management)
 * =========================== */
router.use("/employers", employerRoutes);

/* ===========================
 * APPLICATION ROUTES (Job Applications & Tracking)
 * =========================== */
router.use("/applications", applicationRoutes);

/* ===========================
 * WELCOME ROUTE (Homepage)
 * =========================== */
router.get("/", welcomeController.showHomePage);

module.exports = router;
