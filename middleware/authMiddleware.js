const jwt = require("jsonwebtoken");

// ✅ Authenticate User (Protects routes)
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// ✅ Authorize Admin or Self (Users can only modify their own profile)
const authorizeAdminOrSelf = (req, res, next) => {
  if (req.user.userType === "admin" || req.user.userId === req.params.id) {
    return next();
  }
  res
    .status(403)
    .json({ error: "Unauthorized. You can only modify your own profile." });
};

// ✅ Authorize Employer (Restricts certain routes to employers)
const authorizeEmployer = (req, res, next) => {
  if (req.user.userType === "employer") {
    return next();
  }
  res.status(403).json({ error: "Unauthorized. Employers only." });
};

module.exports = { authenticateUser, authorizeAdminOrSelf, authorizeEmployer };
