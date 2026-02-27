const mongoose = require("mongoose");
const { watch } = require("./userModel");
//Creating the Watchlist Schema
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
                //store film ID from OMDb
                imdbID: {
                    type: String,
                    required: true
                },
                watchedStatus: {
                    type: Boolean,
                    default: false
                },
                addedAt: {
                    type: Date,
                    default: Date.now // When the film was added to the watchlist
                },
                watchedAt: {
                    type: Date,
                    default: null // When the film was watched  
                }
            }
        ]
    },
    { collection: "userWatchlists" }
);

module.exports = mongoose.model("userWatchlists", userWatchlistSchema);