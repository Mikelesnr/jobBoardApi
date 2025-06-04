const Job = require("../models/job");

/* ===========================
 * CREATE JOB (Employer Only)
 * =========================== */
const createJob = async (req, res) => {
  try {
    if (req.user.userType !== "employer") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Only employers can post jobs." });
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
    res.status(201).json({ message: "Job posted successfully!", job: newJob });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * EDIT JOB (Employer Only)
 * =========================== */
const editJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          error: "Unauthorized: You can only edit your own job postings.",
        });
    }

    // Preserve existing company image if not provided in update
    job.companyImage =
      req.body.companyImage ||
      job.companyImage ||
      "/images/default-company.png";

    await job.save();
    res.status(200).json({ message: "Job updated successfully!", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * DELETE JOB (Employer Only)
 * =========================== */
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          error: "Unauthorized: You can only delete your own job postings.",
        });
    }

    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * GET ALL JOBS (Anyone Can View)
 * =========================== */
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer", "name email"); // Show employer name & email

    if (!jobs.length) {
      return res.status(404).json({ error: "No jobs found." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * GET JOB BY ID (Anyone Can View)
 * =========================== */
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("employer", "name email");

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error retrieving job:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createJob,
  editJob,
  deleteJob,
  getAllJobs,
  getJobById,
};
