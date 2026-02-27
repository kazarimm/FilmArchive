const express = require('express');
const router = express.Router();
const Comment = require('../models/comment'); 


router.get('/test', (req, res) => {
    res.json({ message: "Comments route is working" });
});


router.post('/', async (req, res) => {
    console.log("🔥 Incoming request body:", req.body);

    try {
        const newComment = new Comment({
            content: req.body.content,
            filmId: req.body.filmId,
            userId: req.body.userId,
            username: req.body.username
        });

        const savedComment = await newComment.save();

        console.log("✅ Saved to MongoDB:", savedComment);

        res.status(201).json(savedComment);

    } catch (error) {
        console.error("❌ Error saving comment:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;