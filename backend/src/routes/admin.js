import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [userStats, feedbackStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
            adminUsers: {
              $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
            },
          },
        },
      ]),
      Feedback.aggregate([
        {
          $group: {
            _id: null,
            totalFeedback: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        users: userStats[0] || { totalUsers: 0, activeUsers: 0, adminUsers: 0 },
        feedback: feedbackStats[0] || { totalFeedback: 0 },
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin panel
// @access  Private (Admin only)
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// @route   GET /api/admin/feedback
// @desc    Get all feedback for admin panel
// @access  Private (Admin only)
router.get("/feedback", requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find({})
      .populate("recipient", "name username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.json({
      success: true,
      feedback,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user status
// @access  Private (Admin only)
router.put("/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: Boolean(isActive) },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
});

// @route   DELETE /api/admin/feedback/:id
// @desc    Delete feedback
// @access  Private (Admin only)
router.delete("/feedback/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
    });
  }
});

export default router;
