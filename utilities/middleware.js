const jwt = require("jsonwebtoken");

/* =========================== */
/* AUTHENTICATION MIDDLEWARE */
/* =========================== */
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden: Invalid token." });
  }
};

/* =========================== */
/* ERROR HANDLING MIDDLEWARE */
/* =========================== */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error." });
};

/* =========================== */
/* REQUEST LOGGING MIDDLEWARE */
/* =========================== */
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

/* =========================== */
/* EMPLOYER AUTHORIZATION MIDDLEWARE */
/* =========================== */
const authorizeEmployer = (req, res, next) => {
  if (req.user.userType !== "employer") {
    return res.status(403).json({
      error: "Forbidden: Only employers can access this resource.",
    });
  }
  next(); // ✅ Proceed to the next middleware/controller function
};

/* =========================== */
/* APPLICANT AUTHORIZATION MIDDLEWARE */
/* =========================== */
const authorizeApplicant = (req, res, next) => {
  if (req.user.userType !== "applicant" && req.user.userType !== "github") {
    return res.status(403).json({
      error: "Forbidden: Only applicants can access this resource.",
    });
  }
  next(); // ✅ Proceed to the next middleware/controller function
};

module.exports = {
  authenticateUser,
  errorHandler,
  requestLogger,
  authorizeEmployer,
  authorizeApplicant,
};

/* =========================== */
/* ADMIN AUTHORIZATION MIDDLEWARE */
/* =========================== */
const authorizeAdmin = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({
      error: "Forbidden: Only admins can access this resource.",
    });
  }
  next(); // ✅ Proceed to the next middleware/controller function
};

module.exports = {
  authenticateUser,
  errorHandler,
  requestLogger,
  authorizeEmployer,
  authorizeApplicant,
  authorizeAdmin,
};
