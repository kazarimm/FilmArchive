const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserWatchList = require("../../models/userWatchlists");

router.post("/add", async (req, res) => {
    console.log("REQ BODY:", req.body);
    console.log("watchedStatus:", req.body.watchedStatus, typeof req.body.watchedStatus);
    
    try {
        const {userId, imdbID, watchedStatus } = req.body;
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
        console.log("FULL BODY:", req.body);
console.log("watchedStatus VALUE:", watchedStatus);
console.log("watchedStatus TYPE:", typeof watchedStatus);
        watchlist.films.push({ 
            imdbID,
            addedAt: new Date(),
            watchedAt: null,
            watchedStatus: watchedStatus === true || watchedStatus === "true" // Convert string to boolean if necessary
        });

        await watchlist.save();
        res.status(201).json({ message: "Film added to watchlist" });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;