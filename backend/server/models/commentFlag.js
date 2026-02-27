const mongoose = require("mongoose");

const CommentFlagSchema = new mongoose.Schema({
  
  // Reference to the flagged comment
  commentId: {
    type: String,
    ref: "Comment",
    required: true
  },

  // Reason for flagging
  reason: {
    type: String,
    maxlength: 300
  },

  // Status of review
  reviewStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

}, { 
  timestamps: true 
});

module.exports = mongoose.model("CommentFlag", CommentFlagSchema, "commentFlags");