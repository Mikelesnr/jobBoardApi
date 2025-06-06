const asyncHandler = require("express-async-handler");
const Application = require("../models/application");
const Applicant = require("../models/applicant");
const Job = require("../models/job");

/* =========================== */
/* APPLY FOR A JOB (Applicants & GitHub Users) */
/* =========================== */
const applyForJob = asyncHandler(async (req, res) => {
  try {
    const { jobId } = req.body;

    // Verify that the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Find the applicant profile using the authenticated user's ID
    const applicant = await Applicant.findOne({ userId: req.user.userId });
    if (!applicant) {
      return res.status(404).json({ error: "Applicant profile not found." });
    }

    // Create the new application using the applicantId from the profile
    const newApplication = new Application({
      applicantId: applicant._id,
      jobId,
      status: "Pending",
    });

    await newApplication.save();
    res.status(201).json({
      message: "Application submitted successfully!",
      application: newApplication,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/* =========================== */
/* VIEW APPLICATION STATUS (Applicants & GitHub Users) */
/* =========================== */
const getApplicationStatus = asyncHandler(async (req, res) => {
  try {
    const { jobId } = req.params; // Extract jobId from request body

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required." });
    }

    // Find the applicant profile using the authenticated user's userId
    const applicant = await Applicant.findOne({ userId: req.user.userId });

    if (!applicant) {
      return res.status(404).json({ error: "Applicant profile not found." });
    }

    // Filter applications by the applicantId and the provided jobId
    const applications = await Application.find({
      applicantId: applicant._id,
      jobId: jobId, // Filtering by jobId
    });

    if (!applications.length) {
      return res.status(404).json({ error: "You did not apply for this job." });
    }

    res.status(200).json({ status: applications[0].status }); // Return the first application found
  } catch (error) {
    console.error("Error fetching application status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/* =========================== */
/* EMPLOYERS UPDATE APPLICATION STATUS (Only for Their Own Job Listings) */
/* =========================== */
const updateApplicationStatus = asyncHandler(async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await Application.findById(appId).populate("jobId");

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Ensure employer owns the job before updating status
    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error:
          "Unauthorized: You can only update applications for your own job listings.",
      });
    }

    application.status = req.body.status;
    await application.save();
    res.status(200).json({
      message: "Application status updated successfully!",
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/* =========================== */
/* GET USER APPLICATIONS (Applicants & GitHub Users) */
/* =========================== */
const getUserApplications = asyncHandler(async (req, res) => {
  try {
    // Find the applicant profile using the authenticated user's userId
    const applicant = await Applicant.findOne({ userId: req.user.userId });

    if (!applicant) {
      return res.status(404).json({ error: "Applicant profile not found." });
    }

    // Use applicant._id instead of req.user._id
    const applications = await Application.find({
      applicantId: applicant._id,
    }).populate("jobId");

    if (!applications.length) {
      return res.status(404).json({ error: "No applications found." });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching application status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/* =========================== */
/* GET APPLICATIONS FOR A JOB (Employers Only) */
/* =========================== */
const getJobApplications = asyncHandler(async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId,
    }).populate("applicantId");

    if (!applications.length) {
      return res
        .status(404)
        .json({ error: "No applications found for this job." });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = {
  applyForJob,
  getApplicationStatus,
  updateApplicationStatus,
  getUserApplications,
  getJobApplications,
};
