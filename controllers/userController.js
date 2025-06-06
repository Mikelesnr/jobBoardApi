const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employer = require("../models/employer");
const Applicant = require("../models/applicant");
const Job = require("../models/job");
const Application = require("../models/application");

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

    // ✅ Allow login without password for GitHub users
    if (
      user.userType !== "github" &&
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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
 * GITHUB OAUTH LOGIN
 * =========================== */
const githubOAuthLogin = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user`;
  res.redirect(githubAuthUrl);
};

const githubOAuthCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res
      .status(400)
      .json({ error: "Missing authorization code from GitHub." });
  }

  try {
    // 🔥 Fetch GitHub OAuth token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return res
        .status(400)
        .json({ error: `GitHub OAuth error: ${tokenData.error_description}` });
    }

    const access_token = tokenData.access_token;
    if (!access_token) {
      return res
        .status(400)
        .json({ error: "Failed to obtain GitHub access token." });
    }

    // 🔥 Fetch GitHub user details
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const githubUser = await githubUserResponse.json();
    if (!githubUser.login) {
      return res
        .status(400)
        .json({ error: "Failed to retrieve GitHub user data." });
    }

    // 🔍 Check if username already exists
    let user = await User.findOne({ username: githubUser.login });

    if (!user) {
      // 🛠️ Handle potential duplicate email conflict
      const existingEmailUser = await User.findOne({ email: githubUser.email });
      if (existingEmailUser) {
        return res
          .status(409)
          .json({ error: "An account with this email already exists." });
      }

      // ✅ Use `findOneAndUpdate` to prevent duplicate errors
      user = await User.findOneAndUpdate(
        { username: githubUser.login },
        {
          $setOnInsert: {
            name: githubUser.name || githubUser.login,
            email: githubUser.email || `${githubUser.login}@github.com`,
            password: null, // No password needed for OAuth users
            userType: "github",
          },
        },
        { upsert: true, new: true }
      );
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "GitHub login successful!", token, user });
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    res.status(500).json({ error: "Internal server error." });
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

    if (
      userType !== "admin" &&
      userId.toString() !== req.params.id.toString()
    ) {
      return res.status(403).json({
        error: "Unauthorized: You can only edit your own account details.",
      });
    }

    if (userType !== "admin" && req.body.userType) {
      delete req.body.userType;
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

    // ✅ Ensure only the user or an admin can delete the account
    if (
      requestingUser.userType !== "admin" &&
      requestingUser.userId.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own account." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user.userType === "employer") {
      await Employer.findOneAndDelete({ userId });
      await Job.deleteMany({ employer: userId });
    } else if (user.userType === "applicant" || user.userType === "github") {
      await Applicant.findOneAndDelete({ userId });
      await Application.deleteMany({ applicantId: userId });
    }

    // ✅ Finally, delete the user itself
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
  githubOAuthLogin,
  githubOAuthCallback,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
