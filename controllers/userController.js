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
 * USER LOGIN (Anyone)
 * =========================== */
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    ); // Ensure password is available for comparison

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

    // ✅ Exclude password from the response
    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(200)
      .json({ message: "Login successful", token, user: userResponse });
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
 * GET USER BY ID (Admin or Self)
 * =========================== */
const getUserById = async (req, res) => {
  try {
    // Extract userId from the token
    const { userId, userType } = req.user;

    // If requesting own profile, use token userId
    const targetUserId = userType === "admin" ? req.params.id : userId;

    const user = await User.findById(targetUserId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * UPDATE USER PROFILE (Admin or Self)
 * =========================== */
const updateUser = async (req, res) => {
  try {
    // Extract userId and userType from the token
    const { userId, userType } = req.user;

    console.log("Token userId:", userId, "Request userId:", req.params.id); // Debugging

    // Ensure only admins or the user themselves can update their profile
    if (
      userType !== "admin" &&
      userId.toString() !== req.params.id.toString()
    ) {
      return res.status(403).json({
        error: "Unauthorized: You can only edit your own account details.",
      });
    }

    // Prevent non-admins from changing their `userType`
    if (userType !== "admin" && req.body.userType) {
      delete req.body.userType;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User account updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===========================
 * DELETE USER (Admin or Self)
 * =========================== */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (
      !user ||
      (req.user.userType !== "admin" &&
        req.user._id.toString() !== user._id.toString())
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own profile." });
    }

    if (user.userType === "applicant") {
      await Application.deleteMany({ applicantId: user._id });
    }

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
