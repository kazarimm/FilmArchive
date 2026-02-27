const express = require ("express");
const router = express.Router();
const UserWatchList = require("../../models/userWatchlists");
const { watch } = require("../../models/userModel");

router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ 
                error: "userId is required" 
            });
        }

        const watchlist = await UserWatchList.findOne({ user: userId });
        if (!watchlist) {
            return res.status(404).json({ 
                error: "Watchlist not found" 
            });
        }

        res.status(200).json({
            films: watchlist.films
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: "Server Error" 
        });
    }
});

module.exports = router;