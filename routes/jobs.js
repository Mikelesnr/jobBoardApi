const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const {
  authenticateUser,
  authorizeEmployer,
  authorizeAdmin,
} = require("../utilities/middleware");

/* #swagger.tags = ['Jobs']
   #swagger.description = 'Create a new job listing (Employers Only)' */
router.post(
  "/create",
  authenticateUser,
  authorizeEmployer,
  jobController.createJob
);

/* #swagger.tags = ['Jobs']
   #swagger.description = 'Edit an existing job listing (Employers Only)' */
router.put(
  "/:id/edit",
  authenticateUser,
  authorizeEmployer,
  jobController.editJob
);

/* #swagger.tags = ['Jobs']
   #swagger.description = 'Delete a job listing (Employers or Admin Only)' */
router.delete(
  "/:id",
  authenticateUser,
  authorizeEmployer || authorizeAdmin,
  jobController.deleteJob
);

/* #swagger.tags = ['Jobs']
   #swagger.description = 'Retrieve all job listings' */
router.get("/", jobController.getAllJobs);

/* #swagger.tags = ['Jobs']
   #swagger.description = 'Retrieve a specific job listing by ID' */
router.get("/:id", jobController.getJobById);

module.exports = router;
