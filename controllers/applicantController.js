const Applicant = require("../models/applicant");

/* =========================== */
/* CREATE APPLICANT PROFILE (Applicants & GitHub OAuth Users) */
/* =========================== */
const createApplicantProfile = async (req, res) => {
  try {
    const newApplicant = new Applicant({
      userId: req.user.userId,
      resumeUrl: req.body.resumeUrl || "",
      skills: req.body.skills || [],
      experience: req.body.experience || [],
      education: req.body.education || [],
    });

    await newApplicant.save();
    res.status(201).json({
      message: "Applicant profile created successfully!",
      applicant: newApplicant,
    });
  } catch (error) {
    console.error("Error creating applicant profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* GET APPLICANT PROFILE (Admin, Applicants & GitHub OAuth Users) */
/* =========================== */
const getApplicantProfile = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ userId: req.user.userId });

    if (!applicant) {
      return res.status(404).json({ error: "Applicant profile not found." });
    }

    res.status(200).json(applicant);
  } catch (error) {
    console.error("Error fetching applicant profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* UPDATE APPLICANT PROFILE (Admin, Applicants & GitHub OAuth Users) */
/* =========================== */
const updateApplicantProfile = async (req, res) => {
  try {
    const filter =
      req.user.userType === "admin"
        ? { userId: req.params.id }
        : { userId: req.user.userId };

    const applicant = await Applicant.findOne(filter);

    if (!applicant) {
      return res.status(404).json({
        error: "Applicant profile not found or unauthorized.",
      });
    }

    const updatedApplicant = await Applicant.findOneAndUpdate(
      filter,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Applicant profile updated successfully!",
      applicant: updatedApplicant,
    });
  } catch (error) {
    console.error("Error updating applicant profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createApplicantProfile,
  getApplicantProfile,
  updateApplicantProfile,
};
