const Employer = require("../models/employer");
const Job = require("../models/job");
const Application = require("../models/application");

/* ===========================
 * CREATE EMPLOYER PROFILE (Employers Only)
 * =========================== */
const createEmployerProfile = async (req, res) => {
  try {
    // Extract userId and userType from the token
    const { userId, userType } = req.user;

    if (userType !== "employer") {
      return res.status(403).json({
        error: "Forbidden: Only employers can create an employer profile.",
      });
    }

    const newEmployer = new Employer({
      userId: userId, // Use userId from token
      companyName: req.body.companyName || "",
      jobListings: req.body.jobListings || [],
    });

    await newEmployer.save();
    res.status(201).json({
      message: "Employer profile created successfully!",
      employer: newEmployer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * GET EMPLOYER PROFILE (Admin or Employer)
 * =========================== */
const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) return res.status(404).send("Employer profile not found");

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).send("Error fetching employer profile: " + error.message);
  }
};

/* ===========================
 * UPDATE EMPLOYER PROFILE (Admin or Employer)
 * =========================== */
const updateEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user._id });
    if (!employer && req.user.userType !== "admin") {
      return res.status(404).json({
        error:
          "Employer profile not found or you do not have permission to edit it.",
      });
    }

    // Update profile fields like companyName and jobListings
    const updatedEmployer = await Employer.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Employer profile updated successfully!",
      employer: updatedEmployer,
    });
  } catch (error) {
    res.status(500).send("Error updating employer profile: " + error.message);
  }
};

/* ===========================
 * POST JOB LISTING (Employers Only)
 * =========================== */
const postJob = async (req, res) => {
  try {
    const newJob = new Job({
      employerId: req.user._id,
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
    });

    await newJob.save();
    res.status(201).send("Job posted successfully! 🚀");
  } catch (error) {
    res.status(500).send("Error posting job: " + error.message);
  }
};

/* ===========================
 * GET JOB APPLICATIONS (Employer Only)
 * =========================== */
const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId,
    }).populate("applicantId");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).send("Error fetching applications: " + error.message);
  }
};

/* ===========================
 * UPDATE APPLICATION STATUS (Employers Only)
 * =========================== */
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).send("Application not found");

    application.status = req.body.status;
    await application.save();
    res.status(200).send("Application status updated successfully!");
  } catch (error) {
    res.status(500).send("Error updating application: " + error.message);
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
