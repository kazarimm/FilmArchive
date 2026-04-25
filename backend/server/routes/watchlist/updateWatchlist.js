const express = require("express");
const router = express.Router();
const UserWatchList = require("../../models/userWatchlists");

router.patch("/update", async (req, res) => {
  try {
    const { userId, imdbID, watchedStatus, liked } = req.body;

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

    const film = watchlist.films.find((film) => film.imdbID === imdbID);

    if (!film) {
      return res.status(404).json({
        error: "Film not found in watchlist"
      });
    }

    if (watchedStatus !== undefined) {
      film.watchedStatus =
        watchedStatus === true || watchedStatus === "true";

      film.watchedAt = film.watchedStatus ? new Date() : null;
    }

    if (liked !== undefined) {
      film.liked = liked === true || liked === "true";
    }

    await watchlist.save();

    res.status(200).json({
      message: "Watchlist film updated",
      film
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error"
    });
  }
});

module.exports = router;