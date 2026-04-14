const express = require("express");
const router = express.Router();
const UserWatchList = require("../../models/userWatchlists");

router.delete("/remove/:userId/:imdbID", async (req, res) => {
    try {
        const { userId, imdbID } = req.params;

        if (!userId || !imdbID) {
            return res.status(400).json({
                error: "userId and imdbID are required"
            });
        }

        const watchlist = await UserWatchList.findOne({ user: userId });

        if (!watchlist) {
            return res.status(404).json({
                error: "Watchlist not found"
            });
        }

        watchlist.films = watchlist.films.filter(
            film => film.imdbID !== imdbID
        );

        await watchlist.save();

        res.status(200).json({
            message: "Film removed from watchlist",
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