const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // For authentication

/* ===========================
 * CREATE USER (Anyone)
 * =========================== */
const createUser = async (req, res) => {
  try {
    console.log("Incoming Request:", req.body);

    // Hash the password before saving
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
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * USER LOGIN
 * =========================== */
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Generate JWT token for authentication
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * GET ALL USERS (Admin Only)
 * =========================== */
const getAllUsers = async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Only admins can view all users." });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * GET USER BY ID (Admin or User Themselves)
 * =========================== */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Allow admin or the user themselves to access the data
    if (
      !user ||
      (req.user.userType !== "admin" &&
        req.user._id.toString() !== user._id.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only view your own profile." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * UPDATE USER (User or Admin)
 * =========================== */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Allow admin or the user themselves to edit
    if (
      !user ||
      (req.user.userType !== "admin" &&
        req.user._id.toString() !== user._id.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own profile." });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * DELETE USER (Admin Can Delete Any User, Users Can Delete Themselves)
 * =========================== */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Allow admin to delete any user or allow user to delete themselves
    if (
      !user ||
      (req.user.userType !== "admin" &&
        req.user._id.toString() !== user._id.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own profile." });
    }

    // ✅ Cascade delete applications if user is an applicant
    if (user.userType === "applicant") {
      await Application.deleteMany({ applicantId: user._id });
    }

    // ✅ Cascade delete job postings if user is an employer
    if (user.userType === "employer") {
      await Job.deleteMany({ employerId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
