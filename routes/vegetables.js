// routes/vegetables.js
const express = require("express");
const VegetableController = require("../controllers/vegetableController");
const { requireAdminOrManager } = require("../middleware/auth");

const router = express.Router();

// Vegetable Management Routes (Admin & Manager)
router.get("/", requireAdminOrManager, VegetableController.getAllVegetables);
router.get("/:id", requireAdminOrManager, VegetableController.getVegetableById);
router.post("/", requireAdminOrManager, VegetableController.createVegetable);
router.put("/:id", requireAdminOrManager, VegetableController.updateVegetable);
router.delete(
  "/:id",
  requireAdminOrManager,
  VegetableController.deleteVegetable
);

module.exports = router;
