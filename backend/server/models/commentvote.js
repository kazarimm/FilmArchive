const mongoose = require('mongoose');

const CommentVoteSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: Number,
        enum: [1, -1], // 1 = upvote, -1 = downvote
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent same user voting twice on same comment
CommentVoteSchema.index({ commentId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CommentVote', CommentVoteSchema);