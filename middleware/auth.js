const passport = require("passport");

// Authenticate JWT token
const authenticateToken = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Authentication error" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Check if user is Admin (for User Management APIs)
const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.userType !== "Admin") {
      return res.status(403).json({
        message:
          "Access denied. Only Admin users can access User Management APIs.",
      });
    }
    next();
  });
};

// Check if user is Admin or Manager (for Vegetable Management APIs)
const requireAdminOrManager = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (!["Admin", "Manager"].includes(req.user.userType)) {
      return res.status(403).json({
        message:
          "Access denied. Admin or Manager access required for Vegetable Management APIs.",
      });
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAdminOrManager,
};
