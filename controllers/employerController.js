const Employer = require("../models/employer");
const Job = require("../models/job");
const Application = require("../models/application");

// Get employer profile
const getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) return res.status(404).send("Employer profile not found");

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).send("Error fetching employer profile: " + error.message);
  }
};

// Update employer profile
const updateEmployerProfile = async (req, res) => {
  try {
    const updatedEmployer = await Employer.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployer)
      return res.status(404).send("Employer profile not found");

    res.status(200).json(updatedEmployer);
  } catch (error) {
    res.status(500).send("Error updating employer profile: " + error.message);
  }
};

// Post a new job listing
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

// Get applications for employer's job postings
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

// Update application status (accept, reject, interview, etc.)
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
  getEmployerProfile,
  updateEmployerProfile,
  postJob,
  getJobApplications,
  updateApplicationStatus,
};
