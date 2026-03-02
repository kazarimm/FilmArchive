const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    filmId: {
        type: String,   // <-- CHANGE to String for now (easier for testing)
        required: true
    },

    userId: {
        type: String,   // <-- CHANGE to String for now
        required: true
    },

    username: {
        type: String,
        required: true
    },

    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);