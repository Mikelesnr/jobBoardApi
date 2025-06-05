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
/* GET APPLICANT PROFILE */
/* =========================== */
const getApplicantProfile = async (req, res) => {
  try {
    const { userId: authenticatedUserId, userType } = req.user; // Authenticated user's ID and type

    let queryUserId; // This will be the User ID we search by

    // Logic to determine which User ID to use for the query
    if (userType === "applicant" || userType === "github") {
      // <--- MODIFIED HERE
      // If the authenticated user is an applicant or github user, they can only view their own profile
      if (req.params.id && req.params.id !== authenticatedUserId.toString()) {
        // Prevent an applicant/github user from trying to view another's profile via /profile/:id
        return res
          .status(403)
          .json({
            error: "Forbidden: You can only view your own applicant profile.",
          });
      }
      queryUserId = authenticatedUserId; // Applicant/Github user is requesting their own profile
    } else if (userType === "admin" || userType === "employer") {
      // Admins and Employers can view any applicant profile by providing the User's ID in the path
      if (!req.params.id) {
        // If no ID is provided, and it's not an applicant requesting their own, this route is invalid
        return res
          .status(400)
          .json({ error: "User ID is required for Admin/Employer lookup." });
      }
      queryUserId = req.params.id; // Admin/Employer is requesting by specific User ID
    } else {
      // Fallback for unauthorized user types
      return res
        .status(403)
        .json({
          error: "Forbidden: Not authorized to view applicant profiles.",
        });
    }

    // Find the Applicant profile using the 'userId' field, then populate the associated user's name and email
    const applicant = await Applicant.findOne({ userId: queryUserId }).populate(
      "userId",
      "name email"
    );

    if (!applicant) {
      return res
        .status(404)
        .json({ error: "Applicant profile not found for the specified user." });
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
