const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const {
  authenticateUser,
  authorizeEmployer,
  authorizeAdmin,
} = require("../utilities/middleware");

router.post(
  "/create",
  authenticateUser,
  authorizeEmployer,
  jobController.createJob
);

router.put(
  "/:id/edit",
  authenticateUser,
  authorizeEmployer,
  jobController.editJob
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeEmployer || authorizeAdmin,
  jobController.deleteJob
);

router.get("/", jobController.getAllJobs);

router.get("/:id", jobController.getJobById);

module.exports = router;
