/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - userType
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         name:
 *           type: string
 *           description: Full name of the user (optional, min 2 characters)
 *         username:
 *           type: string
 *           description: Unique username
 *         email:
 *           type: string
 *           format: email
 *           description: Unique email address for the user
 *         password:
 *           type: string
 *           description: Hashed password (required unless userType is 'github')
 *         userType:
 *           type: string
 *           enum:
 *             - admin
 *             - employer
 *             - applicant
 *             - github
 *           description: Defines the role of the user in the system
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was registered
 *       example:
 *         _id: "6563b5a6b6cd5f0012a9a7f7"
 *         name: "John Doe"
 *         username: "johndoe123"
 *         email: "johndoe@example.com"
 *         userType: "applicant"
 *         createdAt: "2025-06-06T02:45:00Z"
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, minlength: 2 },
  username: { type: String, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: function () {
      return this.userType !== "github";
    },
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "employer", "applicant", "github"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
