const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
router.post('/create', async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();

    res.status(200).json({
      success: true,
      comment: savedComment
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



module.exports = router;