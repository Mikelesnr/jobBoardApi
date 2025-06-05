const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const {
  authenticateUser,
  authorizeEmployer,
  authorizeAdmin,
} = require("../utilities/middleware");

/* =========================== */
/* CREATE JOB (Employers Only) */
/* =========================== */
router.post(
  "/create",
  authenticateUser,
  authorizeEmployer,
  jobController.createJob
);

/* =========================== */
/* EDIT JOB (Employers Only) */
/* =========================== */
router.put(
  "/:id/edit",
  authenticateUser,
  authorizeEmployer,
  jobController.editJob
);

/* =========================== */
/* DELETE JOB (Employers Only) */
/* =========================== */
router.delete(
  "/:id",
  authenticateUser,
  authorizeEmployer || authorizeAdmin,
  jobController.deleteJob
);

/* =========================== */
/* GET ALL JOBS (Public) */
/* =========================== */
router.get("/", jobController.getAllJobs);

/* =========================== */
/* GET JOB BY ID (Public) */
/* =========================== */
router.get("/:id", jobController.getJobById);

module.exports = router;
