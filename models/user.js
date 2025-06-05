const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true }, // ✅ Remove `required: true` to allow GitHub users
  username: { type: String, unique: true, trim: true }, // ✅ Add GitHub username field
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: function () {
      return this.userType !== "github";
    }, // ✅ Allow empty password for OAuth users
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "employer", "applicant", "github"], // ✅ Add "github" as a valid userType
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
