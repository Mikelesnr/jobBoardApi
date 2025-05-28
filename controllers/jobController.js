const Job = require("../models/job");

/* ===========================
 * CREATE JOB (Employer Only)
 * =========================== */
const createJob = async (req, res, next) => {
  try {
    if (req.user.userType !== "employer") {
      return res
        .status(403)
        .send("Unauthorized: Only employers can post jobs.");
    }

    const newJob = new Job({
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      location: req.body.location,
      employer: req.user._id,
      companyImage: req.body.companyImage || "/images/default-company.png", // Set default image if empty
    });

    await newJob.save();
    res.status(201).send("Job posted successfully!");
  } catch (error) {
    next({ status: 500, message: "Error posting job: " + error.message });
  }
};

/* ===========================
 * EDIT JOB (Employer Only)
 * =========================== */
const editJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job || job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send("Unauthorized: You can only edit your own job postings.");
    }

    // Set a default company image if no URL is provided
    job.companyImage =
      req.body.companyImage ||
      job.companyImage ||
      "/images/default-company.png";

    await job.save();
    res.status(200).send("Job updated successfully!");
  } catch (error) {
    next({ status: 500, message: "Error updating job: " + error.message });
  }
};

/* ===========================
 * DELETE JOB (Employer Only)
 * =========================== */
const deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job || job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send("Unauthorized: You can only delete your own job postings.");
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).send("Job deleted successfully!");
  } catch (error) {
    next({ status: 500, message: "Error deleting job: " + error.message });
  }
};

/* ===========================
 * GET ALL JOBS (Anyone Can View)
 * =========================== */
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate("employer", "name email"); // Show employer name & email
    res.status(200).json(jobs);
  } catch (error) {
    next({ status: 500, message: "Error retrieving jobs: " + error.message });
  }
};

/* ===========================
 * GET JOB BY ID (Anyone Can View)
 * =========================== */
const getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("employer", "name email");

    if (!job) {
      return next({ status: 404, message: "Job not found." });
    }

    res.status(200).json(job);
  } catch (error) {
    next({ status: 500, message: "Error retrieving job: " + error.message });
  }
};

module.exports = {
  createJob,
  editJob,
  deleteJob,
  getAllJobs,
  getJobById,
};
