import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/feedback
// @desc    Get user's received feedback
// @access  Private
router.get("/", requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments({ recipient: req.user._id });
    const unreadCount = await Feedback.getUnreadCount(req.user._id);

    res.json({
      success: true,
      feedback,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
      stats: {
        total,
        unread: unreadCount,
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

// @route   PUT /api/feedback/:id/read
// @desc    Mark feedback as read/unread
// @access  Private
router.put("/:id/read", requireAuth, async (req, res) => {
  try {
    const { isRead } = req.body;

    const feedback = await Feedback.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: Boolean(isRead) },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: `Feedback marked as ${isRead ? "read" : "unread"}`,
      feedback,
    });
  } catch (error) {
    console.error("Update feedback read status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
    });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
// @access  Private
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const feedback = await Feedback.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Decrement user's feedback count
    req.user.feedbackCount = Math.max(0, req.user.feedbackCount - 1);
    await req.user.save();

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
