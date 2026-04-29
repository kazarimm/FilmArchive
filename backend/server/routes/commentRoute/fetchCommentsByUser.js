const express = require("express");
const router = express.Router();
const Comment = require("../../models/comment");

router.get("/user/:userId", async (req, res) => {
  try {
    const comments = await Comment.find({ userId: req.params.userId }).sort({
      createdAt: -1
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;