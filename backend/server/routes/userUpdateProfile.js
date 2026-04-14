const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.put("/updateProfile/:id", async (req, res) => {
  try {
    const { username, email, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, bio },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;