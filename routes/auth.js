const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const applicantController = require("../controllers/applicantController");
const employerController = require("../controllers/employerController");
const {
  authenticateUser,
  authorizeAdminOrSelf,
} = require("../middleware/authMiddleware");

/* ===========================
 * REGISTER NEW USER (Public)
 * =========================== */
router.post("/register", userController.createUser);

/* ===========================
 * USER LOGIN (Public)
 * =========================== */
router.post("/login", userController.loginUser);

/* ===========================
 * GET USER PROFILE (Admin or Self)
 * =========================== */
router.get(
  "/profile/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.getUserById
);

/* ===========================
 * UPDATE GENERAL USER INFO (Admin or Self)
 * =========================== */
router.put(
  "/users/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  (req, res, next) => {
    if (!req.body.name && !req.body.email && !req.body.userType) {
      return res.status(400).json({
        error: "Bad Request: Please provide at least one field to update.",
      });
    }
    next();
  },
  userController.updateUser
);

/* ===========================
 * CREATE APPLICANT PROFILE (Applicants Only)
 * =========================== */
router.post(
  "/applicants",
  authenticateUser,
  applicantController.createApplicantProfile
);

/* ===========================
 * UPDATE APPLICANT PROFILE (Admin or Applicant)
 * =========================== */
router.put(
  "/applicants/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  (req, res, next) => {
    if (
      !req.body.resumeUrl &&
      !req.body.skills &&
      !req.body.experience &&
      !req.body.education
    ) {
      return res.status(400).json({
        error: "Bad Request: Please provide at least one field to update.",
      });
    }
    next();
  },
  applicantController.updateApplicantProfile
);

/* ===========================
 * CREATE EMPLOYER PROFILE (Employers Only)
 * =========================== */
router.post(
  "/employers",
  authenticateUser,
  employerController.createEmployerProfile
);

/* ===========================
 * UPDATE EMPLOYER PROFILE (Admin or Employer)
 * =========================== */
router.put(
  "/employers/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  employerController.updateEmployerProfile
);

/* ===========================
 * DELETE USER (Admin or Self)
 * =========================== */
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.deleteUser
);

module.exports = router;
