const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateUser,
  authorizeAdminOrSelf,
} = require("../middleware/authMiddleware");

// USER AUTHENTICATION ROUTES

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

// GITHUB OAUTH ROUTES

router.get("/github", userController.githubOAuthLogin);

router.get("/oauth-callback", userController.githubOAuthCallback);

// USER PROFILE ROUTES

router.get(
  "/profile/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.getUserById
);

router.put(
  "/users/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.updateUser
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.deleteUser
);

module.exports = router;
