const Vegetable = require("../models/Vegetable");
const { vegetableValidation } = require("../utils/validation");

class VegetableController {
  // Get all vegetables
  static async getAllVegetables(req, res) {
    try {
      const vegetables = await Vegetable.find().sort({ name: 1 });
      res.json({ vegetables });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get vegetable by ID
  static async getVegetableById(req, res) {
    try {
      const vegetable = await Vegetable.findById(req.params.id);

      if (!vegetable) {
        return res.status(404).json({ message: "Vegetable not found" });
      }

      res.json({ vegetable });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Create new vegetable
  static async createVegetable(req, res) {
    try {
      const { error, value } = vegetableValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const vegetable = new Vegetable(value);
      await vegetable.save();

      res.status(201).json({
        message: "Vegetable created successfully",
        vegetable,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Update vegetable
  static async updateVegetable(req, res) {
    try {
      const { error, value } = vegetableValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const vegetable = await Vegetable.findByIdAndUpdate(
        req.params.id,
        value,
        { new: true, runValidators: true }
      );

      if (!vegetable) {
        return res.status(404).json({ message: "Vegetable not found" });
      }

      res.json({
        message: "Vegetable updated successfully",
        vegetable,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Delete vegetable
  static async deleteVegetable(req, res) {
    try {
      const vegetable = await Vegetable.findByIdAndDelete(req.params.id);

      if (!vegetable) {
        return res.status(404).json({ message: "Vegetable not found" });
      }

      res.json({ message: "Vegetable deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = VegetableController;
