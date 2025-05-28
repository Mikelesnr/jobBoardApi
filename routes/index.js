const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const jobRoutes = require("./jobs");
const applicationRoutes = require("./applications");
const welcomeController = require("../controllers/welcomeController");

// Prefix routes to organize API structure
router.use("/auth", authRoutes); // User-related routes
router.use("/jobs", jobRoutes); // Job-related routes
router.use("/applications", applicationRoutes); // Application-related routes

// Welcome route
router.get("/", welcomeController.showHomePage);

module.exports = router;
