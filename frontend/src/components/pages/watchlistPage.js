import React, { useState, useEffect } from "react";
import getUserInfo from "../../utilities/decodeJwt";
import WatchlistCard from "./watchlistCard.js";
import "../../css/watchlistPage.css";

const WatchListPage = () => {
  const [films, setFilms] = useState([]);
  const [genreFilter, setGenreFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const user = getUserInfo(accessToken);

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/watchlist/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        // 🔥 ADD GENRE FROM OMDB (IMPORTANT FIX)
        const enrichedFilms = await Promise.all(
          (data.films || []).map(async (film) => {
            try {
              const res = await fetch(
                `http://www.omdbapi.com/?i=${film.imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
              );

              const omdb = await res.json();

              return {
                ...film,
                genre: omdb.Genre || "", // store genre here
              };
            } catch (err) {
              console.error("OMDB error:", err);
              return {
                ...film,
                genre: "",
              };
            }
          })
        );

        setFilms(enrichedFilms);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchData();
  }, []);

  const filteredFilms =
    genreFilter === "all"
      ? films
      : films.filter((film) =>
          (film.genre || "")
            .toLowerCase()
            .includes(genreFilter.toLowerCase())
        );

  const watchedFilms = filteredFilms.filter(
    (film) => film.watchedStatus === true
  );

  const notWatchedFilms = filteredFilms.filter(
    (film) => film.watchedStatus === false
  );

  const toggleWatchedStatus = async (imdbID, currentStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = getUserInfo(accessToken);

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
            watchedStatus: !currentStatus,
          }),
        }
      );

      if (!response.ok) throw new Error();

      setFilms((prev) =>
        prev.map((film) =>
          film.imdbID === imdbID
            ? { ...film, watchedStatus: !currentStatus }
            : film
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update watch status.");
    }
  };

  const toggleLikedStatus = async (imdbID, currentLikedStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = getUserInfo(accessToken);

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
            liked: !currentLikedStatus,
          }),
        }
      );

      if (!response.ok) throw new Error();

      setFilms((prev) =>
        prev.map((film) =>
          film.imdbID === imdbID
            ? { ...film, liked: !currentLikedStatus }
            : film
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update liked status.");
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
      console.error(err);
      alert("Failed to remove film.");
    }
  };

  return (
    <div className="films-page">
      <div className="films-scale-wrapper">

        <h1 className="films-title">Your Watchlist</h1>

        {/* SIMPLE GENRE FILTER */}
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          style={{
            marginBottom: "20px",
            padding: "8px 12px",
            borderRadius: "20px",
            background: "#111",
            color: "white",
            border: "1px solid #333",
          }}
        >
          <option value="all">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Crime">Crime</option>
          <option value="Thriller">Thriller</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Documentary">Documentary</option>
          
        </select>

        {/* NOT WATCHED */}
        <h2 className="section-title">Not Watched</h2>
        <div className="films-row">
          {notWatchedFilms.map((film) => (
            <WatchlistCard
              key={film._id}
              film={film}
              liked={film.liked}
              onRemove={removeFromWatchlist}
              onToggleWatchedStatus={toggleWatchedStatus}
              onToggleLikedStatus={toggleLikedStatus}
            />
          ))}
        </div>

        {/* WATCHED */}
        <h2 className="section-title">Watched</h2>
        <div className="films-row">
          {watchedFilms.map((film) => (
            <WatchlistCard
              key={film._id}
              film={film}
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