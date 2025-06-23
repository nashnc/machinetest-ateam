const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { loginValidation } = require("../utils/validation");

class AuthController {
  // Login user
  static async login(req, res) {
    try {
      // Validate input
      const { error, value } = loginValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { email, password } = value;

      // Use passport local strategy
      passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }

        if (!user) {
          return res.status(400).json({ message: info.message });
        }

        // Generate JWT token
        const payload = {
          id: user._id,
          email: user.email,
          userType: user.userType,
        };

        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "24h" }
        );

        res.json({
          message: "Login was a success",
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType,
          },
        });
      })(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = AuthController;
