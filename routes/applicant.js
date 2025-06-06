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

/**
 * @swagger
 * tags:
 *   - name: Applicants
 *     description: Routes for applicant profiles and job searching
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Applicant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: string
 *         resumeUrl:
 *           type: string
 */

/**
 * @swagger
 * /applicants/profile:
 *   post:
 *     summary: Create an applicant profile
 *     tags: [Applicants]
 *     description: Allows authenticated applicants to create a profile.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Applicant"
 *           example:
 *             skills: ["JavaScript", "React", "Node.js"]
 *             experience: "5 years in software development"
 *             resumeUrl: "https://example.com/resume.pdf"
 *     responses:
 *       201:
 *         description: Applicant profile created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Applicant"
 *       400:
 *         description: Invalid request or missing required fields.
 */
router.post(
  "/profile",
  authenticateUser,
  authorizeApplicant,
  createApplicantProfile
);

/**
 * @swagger
 * /applicants/profile:
 *   get:
 *     summary: Retrieve applicant profile
 *     tags: [Applicants]
 *     description: Fetches the authenticated user's applicant profile.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved applicant profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Applicant"
 *       404:
 *         description: Applicant profile not found.
 */
router.get(
  "/profile",
  authenticateUser,
  authorizeApplicant,
  getApplicantProfile
);

/**
 * @swagger
 * /applicants/profile/{id}:
 *   get:
 *     summary: Retrieve an applicant profile by ID
 *     tags: [Applicants]
 *     description: Allows employers or admins to fetch a specific applicant profile.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Applicant ID.
 *     responses:
 *       200:
 *         description: Successfully retrieved applicant profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Applicant"
 *       404:
 *         description: Applicant profile not found.
 */
router.get("/profile/:id", authenticateUser, getApplicantProfile);

/**
 * @swagger
 * /applicants/profile:
 *   put:
 *     summary: Update applicant profile
 *     tags: [Applicants]
 *     description: Allows applicants or admins to update the applicant profile.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Applicant"
 *           example:
 *             skills: ["Python", "Django", "PostgreSQL"]
 *             experience: "7 years in backend development"
 *             resumeUrl: "https://example.com/new_resume.pdf"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid request or missing required fields.
 */
router.put(
  "/profile",
  authenticateUser,
  (req, res, next) => {
    if (authorizeApplicant(req, res, next) || authorizeAdmin(req, res, next)) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  },
  updateApplicantProfile
);

module.exports = router;
