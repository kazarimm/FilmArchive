const express = require('express');
const router = express.Router();
const Comment = require('../../models/comment');

router.get('/:imdbID', async (req, res) => {
  const comments = await Comment.find({ imdbID: req.params.imdbID });
  res.status(200).json(comments);
});

module.exports = router;