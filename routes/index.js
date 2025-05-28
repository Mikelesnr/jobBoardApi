const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const jobRoutes = require("./jobs");
const applicationRoutes = require("./applications");
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
 * APPLICATION ROUTES (Job Applications & Tracking)
 * =========================== */
router.use("/applications", applicationRoutes);

/* ===========================
 * WELCOME ROUTE (Homepage)
 * =========================== */
router.get("/", welcomeController.showHomePage);

module.exports = router;
