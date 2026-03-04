const express = require('express');
const router = express.Router();
const Comment = require('../../models/comment');

router.get('/:filmId', async (req, res) => {
  const comments = await Comment.find({ filmId: req.params.filmId });
  res.status(200).json(comments);
});

module.exports = router;