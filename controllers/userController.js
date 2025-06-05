const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employer = require("../models/employer"); // Assuming you have these models
const Applicant = require("../models/applicant"); // Assuming you have these models
const Job = require("../models/job"); // Assuming you have these models
const Application = require("../models/application"); // Assuming you have these models

/* ===========================
 * Helper Function for JWT Token Generation
 * =========================== */
const generateJwtToken = (user) => {
  return jwt.sign(
    { userId: user._id, userType: user.userType, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* ===========================
 * REGISTER NEW USER (Anyone)
 * =========================== */
const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      userType: req.body.userType,
    };

    const newUser = await User.create(userData);
    res
      .status(201)
      .json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * USER LOGIN (JWT Authentication)
 * =========================== */
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Allow login without password for GitHub users
    if (
      user.userType !== "github" &&
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateJwtToken(user); // Use the helper function

    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(200)
      .json({ message: "Login successful!", token, user: userResponse });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * GET ALL USERS (Admin Only)
 * =========================== */
const getAllUsers = async (req, res) => {
  try {
    // You might want to handle authorization through middleware before this function
    // For now, this inline check remains for clarity
    if (req.user.userType !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Only admins can view all users." });
    }

    const users = await User.find().select("-password"); // Exclude password from results
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * GET USER BY ID (Admin or Self)
 * =========================== */
const getUserById = async (req, res) => {
  try {
    const { userId, userType } = req.user;
    const targetUserId = userType === "admin" ? req.params.id : userId;

    const user = await User.findById(targetUserId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* ===========================
 * UPDATE USER PROFILE (Admin or Self)
 * =========================== */
const updateUser = async (req, res) => {
  try {
    const { userId, userType } = req.user;

    // Prevent non-admins from changing their own userType
    if (userType !== "admin" && req.body.userType) {
      // You can either throw an error or just remove the userType from the update body
      delete req.body.userType;
      // return res.status(403).json({ error: "Unauthorized: Cannot change user type." });
    }

    if (
      userType !== "admin" &&
      userId.toString() !== req.params.id.toString()
    ) {
      return res.status(403).json({
        error: "Unauthorized: You can only edit your own account details.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User account updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* =========================== */
/* DELETE USER (Admin or Self) */
/* =========================== */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUser = req.user;

    // Ensure only the user or an admin can delete the account
    if (
      requestingUser.userType !== "admin" &&
      requestingUser._id.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own account." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Cascade deletion logic based on user type
    if (user.userType === "employer") {
      await Employer.findOneAndDelete({ userId });
      await Job.deleteMany({ employer: userId }); // Delete all jobs created by the employer
    } else if (user.userType === "applicant" || user.userType === "github") {
      await Applicant.findOneAndDelete({ userId });
      await Application.deleteMany({ applicantId: userId }); // Delete all applications by the user
    }

    // Finally, delete the user itself
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "User and associated records deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createUser,
  loginUser,
  // Removed githubOAuthLogin and githubOAuthCallback from exports
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  generateJwtToken, // Exported for use in auth.js callback
};
