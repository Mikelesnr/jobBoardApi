const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateUser,
  authorizeAdminOrSelf,
} = require("../middleware/authMiddleware");

/* ===========================
 * REGISTER NEW USER (Public)
 * =========================== */
router.post("/register", userController.createUser);

/* ===========================
 * USER LOGIN (Public)
 * =========================== */
router.post("/login", userController.loginUser);

/* ===========================
 * GET USER PROFILE (Admin or Self)
 * =========================== */
router.get(
  "/profile/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.getUserById
);

/* ===========================
 * UPDATE USER PROFILE (Admin or Self)
 * =========================== */
router.put(
  "/profile/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.updateUser
);

/* ===========================
 * DELETE USER (Admin or Self)
 * =========================== */
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdminOrSelf,
  userController.deleteUser
);

module.exports = router;
