const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

// Login route
router.post("/login", AuthController.login);

module.exports = router;
