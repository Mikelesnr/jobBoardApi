const Applicant = require("../models/applicant");
const User = require("../models/user");

// Get applicant profile
const getApplicantProfile = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ userId: req.user._id });
    if (!applicant) return res.status(404).send("Applicant profile not found");

    res.status(200).json(applicant);
  } catch (error) {
    res.status(500).send("Error fetching applicant profile: " + error.message);
  }
};

// Update applicant profile
const updateApplicantProfile = async (req, res) => {
  try {
    const updatedApplicant = await Applicant.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedApplicant)
      return res.status(404).send("Applicant profile not found");

    res.status(200).json(updatedApplicant);
  } catch (error) {
    res.status(500).send("Error updating applicant profile: " + error.message);
  }
};

module.exports = { getApplicantProfile, updateApplicantProfile };
