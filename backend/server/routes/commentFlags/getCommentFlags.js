const express = require("express");
const router = express.Router();
const CommentFlag = require("../../models/commentFlag");

// GET - Fetch all comment flags
router.get("/getAll", async (req, res) => {
  try {

    const flags = await CommentFlag.find();

    return res.json(flags);

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;