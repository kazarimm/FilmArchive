import React from "react";
import "../../css/watchlistCard.css";

const WatchlistCard = ({ film }) => {
  return (
    <div className="card">
      <h3>{film.imdbID}</h3>
      <p>Status: {film.watchedStatus ? "Watched" : "Not Watched"}</p>
      <p>Added: {new Date(film.addedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default WatchlistCard;