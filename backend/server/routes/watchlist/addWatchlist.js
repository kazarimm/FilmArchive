const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserWatchList = require("../../models/userWatchlists");

router.post("/add", async (req, res) => {
    try {
        const {userId, imdbID } = req.body;
        if (!userId || !imdbID) {
            return res.status(400).json({ error: "userId and imdbID are required" });
        }

        let watchlist = await UserWatchList.findOne({ user: userId});
        if (!watchlist) {
            watchlist = new UserWatchList({ 
                user: userId,
                films: [] 
            });
        }

        if (watchlist.films.some(film => film.imdbID === imdbID)) {
            return res.status(400).json({ error: "Film already in watchlist" });
        }

        watchlist.films.push({ 
            imdbID,
            addedAt: new Date(),
            watchedAt: null
        });

        await watchlist.save();
        res.status(201).json({ message: "Film added to watchlist" });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;