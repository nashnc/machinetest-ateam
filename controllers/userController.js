const User = require("../models/User");
const { userValidation, userUpdateValidation } = require("../utils/validation");

class UserController {
  // Get all users with pagination, sorting, and search
  static async getAllUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "firstName", // default sort field
        sortOrder = "asc", // default sort order
        search = "",
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Define allowed sort fields - using userType instead of role
      const allowedSortFields = ["firstName", "lastName", "userType"];
      const isValidSortField = allowedSortFields.includes(sortBy);
      const fieldToSort = isValidSortField ? sortBy : "firstName"; // fallback to default

      // Validate sort order
      const isValidSortOrder = sortOrder === "asc" || sortOrder === "desc";
      const order = isValidSortOrder ? (sortOrder === "desc" ? -1 : 1) : 1; // fallback to asc

      // Build search query
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { userType: { $regex: search, $options: "i" } }, // Changed to userType
          ],
        };
      }

      // Build sort object
      const sortObj = {};
      sortObj[fieldToSort] = order;

      const users = await User.find(searchQuery)
        .select("-password")
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum);

      const total = await User.countDocuments(searchQuery);

      res.json({
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalUsers: total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  // Create new user
  static async createUser(req, res) {
    try {
      const { error, value } = userValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        email: value.email.toLowerCase(),
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      const user = new User(value);
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        message: "User created successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { error, value } = userUpdateValidation.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      // Check if email is being updated and already exists
      if (value.email) {
        const existingUser = await User.findOne({
          email: value.email.toLowerCase(),
          _id: { $ne: req.params.id },
        });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "User already exists with this email" });
        }
      }

      const user = await User.findByIdAndUpdate(req.params.id, value, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = UserController;
