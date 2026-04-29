import React, { useState, useEffect } from "react";
import getUserInfo from "../../utilities/decodeJwt";
import WatchlistCard from "./watchlistCard.js";
import "../../css/watchlistPage.css";

const WatchListPage = () => {
  const [films, setFilms] = useState([]);

  const watchedFilms = films.filter((film) => film.watchedStatus === true);
  const notWatchedFilms = films.filter((film) => film.watchedStatus === false);

  const toggleWatchedStatus = async (imdbID, currentStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = getUserInfo(accessToken);

      const newStatus = !currentStatus;

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/watchlist/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: user.id,
            imdbID,
            watchedStatus: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update watch status");
      }

      setFilms((prevFilms) =>
        prevFilms.map((film) =>
          film.imdbID === imdbID
            ? { ...film, watchedStatus: newStatus }
            : film
        )
      );
    } catch (err) {
      console.error("Failed to toggle watch status:", err);
      alert("Failed to update watch status.");
    }
  };

  const toggleLikedStatus = async (imdbID, currentLikedStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = getUserInfo(accessToken);

      const newLikedStatus = !currentLikedStatus;

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/watchlist/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId: user.id,
            imdbID,
            liked: newLikedStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update liked status");
      }

      setFilms((prevFilms) =>
        prevFilms.map((film) =>
          film.imdbID === imdbID
            ? { ...film, liked: newLikedStatus }
            : film
        )
      );
    } catch (err) {
      console.error("Failed to toggle liked status:", err);
      alert("Failed to update liked movie.");
    }
  };

  const removeFromWatchlist = async (imdbID) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = getUserInfo(accessToken);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/watchlist/remove/${user.id}/${imdbID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      setFilms(data.films || []);
    } catch (err) {
      console.error("Failed to remove film:", err);
      alert("Failed to remove film.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const user = getUserInfo(accessToken);
        const userId = user.id;

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/watchlist/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setFilms(data.films || []);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="films-page">
      <div className="films-scale-wrapper">
        <h1 className="films-title">Your Watchlist</h1>

        <h2 className="section-title">Not Watched</h2>
        <div className="films-row">
          {notWatchedFilms.map((film) => (
            <WatchlistCard
              key={film._id}
              film={film}
              watchedStatus={film.watchedStatus}
              liked={film.liked}
              onRemove={removeFromWatchlist}
              onToggleWatchedStatus={toggleWatchedStatus}
              onToggleLikedStatus={toggleLikedStatus}
            />
          ))}
        </div>

        <h2 className="section-title">Watched</h2>
        <div className="films-row">
          {watchedFilms.map((film) => (
            <WatchlistCard
              key={film._id}
              film={film}
              watchedStatus={film.watchedStatus}
              liked={film.liked}
              onRemove={removeFromWatchlist}
              onToggleWatchedStatus={toggleWatchedStatus}
              onToggleLikedStatus={toggleLikedStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchListPage;