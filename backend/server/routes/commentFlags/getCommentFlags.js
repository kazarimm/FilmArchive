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
// GET - Fetch comment flag by ID
router.get("/getById/:id", async (req, res) => {
  try {

    const id = req.params.id;

    const flag = await CommentFlag.findById(id);

    if (!flag) {
      return res.status(404).json({ message: "Comment flag not found" });
    }

    return res.json(flag);

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;