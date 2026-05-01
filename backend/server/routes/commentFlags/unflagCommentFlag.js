const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CommentFlag = require('../../models/commentFlag');

/**
 * @route   PUT /commentFlags/unflag/:commentId
 * @desc    Unflag by finding the record where commentId matches the URL param
 */
router.put('/unflag/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        // 1. Validate ID format
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Comment ID format" 
            });
        }

        // 2. Delete the record where the 'commentId' field matches the ID in the URL
        const result = await CommentFlag.findOneAndDelete({ commentId: commentId });

        // 3. Check if a record actually existed for that comment
        if (!result) {
            return res.status(404).json({ 
                success: false, 
                message: "No flag record found for this specific comment" 
            });
        }

        // 4. Success
        res.status(200).json({ 
            success: true,
            message: "Comment unflagged by removing record associated with commentId", 
            deletedCommentId: commentId 
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

module.exports = router;
