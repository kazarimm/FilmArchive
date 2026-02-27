const mongoose = require('mongoose');

const commentVoteSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comments',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    value: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'comment_votes' }
);


commentVoteSchema.index({ commentId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('comment_votes', commentVoteSchema);
