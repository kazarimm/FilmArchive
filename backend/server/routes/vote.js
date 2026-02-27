const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CommentVote = require('../models/commentVote');

// UPVOTE / DOWNVOTE
router.post('/', async (req, res) => {

    const { commentId, userId, value } = req.body;

    console.log("Incoming vote:", req.body);

    // ✅ Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ error: "Invalid commentId" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
    }

    if (![1, -1].includes(value)) {
        return res.status(400).json({ error: "Vote value must be 1 or -1" });
    }

    try {
        // If vote exists → update it
        // If not → create it
        const vote = await CommentVote.findOneAndUpdate(
            { commentId, userId },
            { value },
            { new: true, upsert: true }
        );

        res.status(200).json(vote);

    } catch (error) {
        console.error("Vote error:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET TOTAL VOTES
router.get('/:commentId', async (req, res) => {

    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ error: "Invalid commentId" });
    }

    try {
        const votes = await CommentVote.find({ commentId });

        const total = votes.reduce((sum, vote) => sum + vote.value, 0);

        res.json({ total });

    } catch (error) {
        console.error("Get vote error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;