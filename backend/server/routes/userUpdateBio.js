const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.put("/updateBio/:id", async (req, res) => {
  try {
    const { bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bio },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating bio" });
  }
});

module.exports = router;