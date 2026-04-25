const mongoose = require("mongoose");

// Creating the Watchlist Schema
const userWatchlistSchema = new mongoose.Schema(
  {
    watchlistName: {
      type: String,
      required: true,
      label: "Watchlist Name",
      default: "My Watchlist"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true
    },
    films: [
      {
        imdbID: {
          type: String,
          required: true
        },
        watchedStatus: {
          type: Boolean,
          default: false
        },
        liked: {
          type: Boolean,
          default: false
        },
        addedAt: {
          type: Date,
          default: Date.now
        },
        watchedAt: {
          type: Date,
          default: null
        }
      }
    ]
  },
  { collection: "userWatchlists" }
);

module.exports = mongoose.model("userWatchlists", userWatchlistSchema);