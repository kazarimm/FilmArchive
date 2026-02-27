const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    userId: {
      type: String,  
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    filmId: {
      type: String,   
      required: true,
    },

    parentCommentId: {
      type: String,   
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { collection: 'comments' }
);

module.exports = mongoose.model('Comment', commentSchema);