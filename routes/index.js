const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const jobRoutes = require("./jobs");
const applicationRoutes = require("./applications");
const employerRoutes = require("./employer");
const applicantRoutes = require("./applicant");
const welcomeController = require("../controllers/welcomeController");

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication, registration, and profile management
 *   - name: Jobs
 *     description: Job postings and management
 *   - name: Applications
 *     description: Job application tracking
 *   - name: Employers
 *     description: Employer profiles and job management
 *   - name: Applicants
 *     description: Applicant profiles and job search
 *   - name: General
 *     description: General application routes
 */

/**
 * @swagger
 * /auth:
 *   get:
 *     tags: [Authentication]
 *     description: Handles authentication routes including login and registration
 */
router.use("/auth", authRoutes);

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     description: Handles job listings and job management
 */
router.use("/jobs", jobRoutes);

/**
 * @swagger
 * /applicants:
 *   get:
 *     tags: [Applicants]
 *     description: Handles applicant profiles and management
 */
router.use("/applicants", applicantRoutes);

/**
 * @swagger
 * /employers:
 *   get:
 *     tags: [Employers]
 *     description: Handles employer profiles and job postings
 */
router.use("/employers", employerRoutes);

/**
 * @swagger
 * /applications:
 *   get:
 *     tags: [Applications]
 *     description: Handles job applications and tracking
 */
router.use("/applications", applicationRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     tags: [General]
 *     description: Welcome route for homepage
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get("/", welcomeController.showHomePage);

module.exports = router;
