import express from "express";
import { requireAuth, validateUsername } from "../middleware/auth.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// @route   GET /api/users/:username
// @desc    Get user public profile
// @access  Public
router.get("/:username", validateUsername, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.toLowerCase(),
      isActive: true,
    }).select("username name bio feedbackCount createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Profile views tracking removed for simplicity

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/users/:username/feedback
// @desc    Submit feedback to user
// @access  Public
router.post("/:username/feedback", validateUsername, async (req, res) => {
  try {
    const { username } = req.params;
    const { message, senderName, senderEmail, isAnonymous } = req.body;

    // Find recipient user
    const recipient = await User.findOne({
      username: username.toLowerCase(),
      isActive: true,
    });

    if (!recipient) {
      console.log("User not found:", username);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Recipient found:", recipient.username);

    // Validate message
    if (!message || message.trim().length < 10) {
      console.log("Message validation failed:", {
        message,
        length: message?.length,
      });
      return res.status(400).json({
        success: false,
        message: "Feedback message must be at least 10 characters long",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Feedback message cannot exceed 500 characters",
      });
    }

    // Create feedback
    const feedback = new Feedback({
      recipient: recipient._id,
      message: message.trim(),
      senderName: isAnonymous ? "Anonymous" : senderName || "Anonymous",
      senderEmail: isAnonymous ? null : senderEmail,
      isAnonymous: Boolean(isAnonymous),
    });

    await feedback.save();

    // Increment recipient's feedback count
    recipient.incrementFeedbackCount().catch(console.error);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: {
        _id: feedback._id,
        message: feedback.message,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
});

export default router;
