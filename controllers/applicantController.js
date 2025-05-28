const Applicant = require("../models/applicant");
const User = require("../models/user");

/* ===========================
 * CREATE APPLICANT PROFILE (Applicants Only)
 * =========================== */
const createApplicantProfile = async (req, res) => {
  try {
    // Extract userId and userType from token
    const { userId, userType } = req.user;

    if (userType !== "applicant") {
      return res.status(401).json({
        error: "Forbidden: Only applicants can create an applicant profile.",
      });
    }

    const newApplicant = new Applicant({
      userId: userId,
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
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * GET APPLICANT PROFILE (Admin or Applicant)
 * =========================== */
const getApplicantProfile = async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ userId: req.user._id });
    if (!applicant) return res.status(404).send("Applicant profile not found");

    res.status(200).json(applicant);
  } catch (error) {
    res.status(500).send("Error fetching applicant profile: " + error.message);
  }
};

/* ===========================
 * UPDATE APPLICANT PROFILE (Admin or Applicant)
 * =========================== */
const updateApplicantProfile = async (req, res) => {
  try {
    console.log(
      "Extracted User ID:",
      req.user.userId,
      "User Type:",
      req.user.userType
    ); // Debugging

    // Allow admins to update any applicant OR allow applicants to update their own profile
    const filter =
      req.user.userType === "admin"
        ? { userId: req.params.id } // Admin updates any applicant
        : { userId: req.user.userId }; // Applicant updates their own profile

    const applicant = await Applicant.findOne(filter);

    if (!applicant) {
      return res
        .status(404)
        .json({
          error:
            "Applicant profile not found or you do not have permission to edit it.",
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
    res
      .status(500)
      .json({ error: "Error updating applicant profile: " + error.message });
  }
};

module.exports = {
  createApplicantProfile,
  getApplicantProfile,
  updateApplicantProfile,
};
