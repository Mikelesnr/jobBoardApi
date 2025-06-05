const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user`;
  res.redirect(githubAuthUrl);
};

const githubOAuthCallback = async (req, res) => {
  console.log("GitHub OAuth Callback:", req.query);
  const { code } = req.query;
  if (!code)
    return res.status(400).json({ error: "Authorization code not provided" });

  try {
    // 🔥 Use the code to get an access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code, // ✅ Use the received authorization code
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;
    if (!access_token)
      return res
        .status(400)
        .json({ error: "Failed to obtain access token from GitHub." });

    // 🔥 Fetch GitHub user details
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const githubUser = await userResponse.json();

    // 🔥 Fetch email separately (GitHub hides emails sometimes)
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const emailData = await emailResponse.json();
    const primaryEmail =
      emailData.find((email) => email.primary && email.verified)?.email ||
      `${githubUser.login}@github.com`;

    // ✅ Store or retrieve user info
    let user = await User.findOne({ email: primaryEmail });

    if (!user) {
      user = await User.create({
        name: githubUser.name || githubUser.login,
        username: githubUser.login,
        email: primaryEmail,
        password: "", // No password needed for OAuth users
        userType: "github",
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      message: "GitHub login successful!",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("GitHub OAuth error:", error);
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
      requestingUser._id.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own account." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // ✅ Cascade deletion logic based on user type
    if (user.userType === "employer") {
      await Employer.findOneAndDelete({ userId });
      await Job.deleteMany({ employer: userId }); // Delete all jobs created by the employer
    } else if (user.userType === "applicant" || user.userType === "github") {
      await Applicant.findOneAndDelete({ userId });
      await Application.deleteMany({ applicantId: userId }); // Delete all applications by the user
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
