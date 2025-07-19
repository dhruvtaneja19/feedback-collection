import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      minlength: [10, "Feedback must be at least 10 characters long"],
      maxlength: [500, "Feedback cannot exceed 500 characters"],
    },
    senderName: {
      type: String,
      trim: true,
      maxlength: [50, "Sender name cannot exceed 50 characters"],
      default: "Anonymous",
    },
    senderEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
feedbackSchema.index({ recipient: 1, createdAt: -1 });

// Static method to get feedback count
feedbackSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
