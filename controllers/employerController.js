const Employer = require("../models/employer");
const Job = require("../models/job");
const Application = require("../models/application");

/* =========================== */
/* CREATE EMPLOYER PROFILE */
/* =========================== */
const createEmployerProfile = async (req, res) => {
  try {
    const newEmployer = new Employer({
      userId: req.user.userId,
      companyName: req.body.companyName || "",
      jobListings: req.body.jobListings || [],
    });

    await newEmployer.save();
    res.status(201).json({
      message: "Employer profile created successfully!",
      employer: newEmployer,
    });
  } catch (error) {
    console.error("Error creating employer profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* GET EMPLOYER PROFILE */
/* =========================== */
const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user.userId });

    if (!employer) {
      return res.status(404).json({ error: "Employer profile not found." });
    }

    res.status(200).json(employer);
  } catch (error) {
    console.error("Error fetching employer profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* UPDATE EMPLOYER PROFILE */
/* =========================== */
const updateEmployerProfile = async (req, res) => {
  try {
    const updatedEmployer = await Employer.findOneAndUpdate(
      { userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEmployer) {
      return res.status(404).json({
        error: "Employer profile not found.",
      });
    }

    res.status(200).json({
      message: "Employer profile updated successfully!",
      employer: updatedEmployer,
    });
  } catch (error) {
    console.error("Error updating employer profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* POST JOB LISTING */
/* =========================== */
const postJob = async (req, res) => {
  try {
    const newJob = new Job({
      employerId: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully!", job: newJob });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* GET JOB APPLICATIONS */
/* =========================== */
const getJobApplications = async (req, res) => {
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
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* UPDATE APPLICATION STATUS */
/* =========================== */
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
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
};

module.exports = {
  createEmployerProfile,
  getEmployerProfile,
  updateEmployerProfile,
  postJob,
  getJobApplications,
  updateApplicationStatus,
};
