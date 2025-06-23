const express = require("express");
const UserController = require("../controllers/userController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// User Management Routes (Admin only)
router.get("/", requireAdmin, UserController.getAllUsers);
router.post("/", requireAdmin, UserController.createUser);
router.put("/:id", requireAdmin, UserController.updateUser);
router.delete("/:id", requireAdmin, UserController.deleteUser);

module.exports = router;
