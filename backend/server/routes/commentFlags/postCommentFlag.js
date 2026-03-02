const express = require("express");
const router = express.Router();
const CommentFlag = require("../../models/commentFlag");

// POST - Add a new comment flag
router.post("/add", async (req, res) => {
  try {

    const { commentId, reason } = req.body;

    // Basic validation
    if (!commentId) {
      return res.status(400).json({ message: "commentId is required" });
    }

    // Create new flag record
    const newFlag = new CommentFlag({
      commentId,
      reason
    });

    // Save to database
    const savedFlag = await newFlag.save();

    return res.status(201).json(savedFlag);

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;