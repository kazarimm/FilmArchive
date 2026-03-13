const express = require('express');
const router = express.Router();
const Comment = require('../../models/comment');

router.get('/:commentId', async (req, res) => {
  const comments = await Comment.find({ _id: req.params.commentId });
  res.status(200).json(comments);
});

module.exports = router;