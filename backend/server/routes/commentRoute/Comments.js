const express = require('express');
const router = express.Router();
const Comment = require('../../models/comment');


router.get('/getAll', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;