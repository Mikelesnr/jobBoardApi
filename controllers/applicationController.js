const asyncHandler = require("express-async-handler");
const Application = require("../models/application");

/* ===========================
 * APPLY FOR A JOB (Applicants Only)
 * =========================== */
const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params; // Ensure jobId comes from params

  const newApplication = new Application({
    applicantId: req.user._id,
    jobId,
    status: "Pending",
  });

  await newApplication.save();
  res.status(201).json({
    message: "Application submitted successfully!",
    application: newApplication,
  });
});

/* ===========================
 * VIEW APPLICATION STATUS (Applicants Only)
 * =========================== */
const getApplicationStatus = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    applicantId: req.user._id,
  }).populate("jobId");
  res.status(200).json(applications);
});

/* ===========================
 * EMPLOYERS UPDATE APPLICATION STATUS (Only for Their Own Job Listings)
 * =========================== */
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { appId } = req.params;
  const application = await Application.findById(appId).populate("jobId");

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  // ✅ Ensure employer owns the job before updating status
  if (application.jobId.employerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      error:
        "Unauthorized: You can only update applications for your own job listings.",
    });
  }

  application.status = req.body.status;
  await application.save();
  res
    .status(200)
    .json({ message: "Application status updated successfully!", application });
});

/* ===========================
 * GET USER APPLICATIONS (Applicants Only)
 * =========================== */
const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    applicantId: req.user._id,
  }).populate("jobId");
  res.status(200).json(applications);
});

/* ===========================
 * GET APPLICATIONS FOR A JOB (Employers Only)
 * =========================== */
const getJobApplications = asyncHandler(async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId,
    }).populate("applicantId");
    res.status(200).json(applications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching job applications: " + error.message });
  }
});

module.exports = {
  applyForJob,
  getApplicationStatus,
  updateApplicationStatus,
  getUserApplications,
  getJobApplications,
};
