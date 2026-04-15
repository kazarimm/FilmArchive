import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import imdbIDs from "../../data/imdb_ids_us_recent.json";
import "../../css/filmsPage.css";

const MovieListDetail = () => {
  const [movies, setMovies] = useState([]);
  const [watchlistMovies] = useState([]);
  const [revealedRMovies, setRevealedRMovies] = useState(new Set());

  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  // eslint-disable-next-line no-unused-vars
  const user = useContext(UserContext); // kept for future use
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("search") || "";

  const toggleRevealR = (imdbID) => {
    setRevealedRMovies((prev) => {
      const newSet = new Set(prev);
      newSet.add(imdbID); // only reveal, no hiding again
      return newSet;
    });
  };

  const isValidPoster = (posterUrl) => {
    if (!posterUrl || posterUrl === "N/A") return false;

    const poster = posterUrl.toLowerCase();

    if (poster.includes("noposter")) return false;
    if (poster.includes("poster-default")) return false;
    if (poster.includes("imdb.com/images")) return false;

    return true;
  };

  // Pick random IMDb IDs from the JSON
  const getRandomIDs = (count) => {
    const shuffled = [...imdbIDs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Fetch random movies until we have enough valid ones
  const fetchRandomMovies = useCallback(async () => {
    try {
      let collectedMovies = [];
      let attempts = 0;

      while (collectedMovies.length < 25 && attempts < 10) {
        attempts++;

        const selectedIDs = getRandomIDs(40); // grab more than needed

        const results = await Promise.all(
          selectedIDs.map(async (id) => {
            const res = await fetch(
              `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
            );
            return res.json();
          })
        );

        const validMovies = results.filter((movie) => {
          if (movie.Response !== "True") return false;
          if (!isValidPoster(movie.Poster)) return false;
          return true;
        });

        collectedMovies = [...collectedMovies, ...validMovies];

        // remove duplicates by imdbID
        collectedMovies = collectedMovies.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.imdbID === movie.imdbID)
        );
      }

      setMovies(collectedMovies.slice(0, 25));
    } catch (err) {
      console.error("Failed to load random movies:", err);
    }
  }, [API_KEY]);

  // Search movies normally if user searches
  const searchMovies = useCallback(async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (!data.Search) {
        setMovies([]);
        return;
      }

      const fullMovies = await Promise.all(
        data.Search.map(async (movie) => {
          const detailRes = await fetch(
            `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`
          );
          return detailRes.json();
        })
      );

      const filteredMovies = fullMovies.filter((movie) => {
        if (movie.Response !== "True") return false;
        if (!isValidPoster(movie.Poster)) return false;
        return true;
      });

      setMovies(filteredMovies);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }, [query, API_KEY]);

  // Reload movies every time Films tab is entered
  useEffect(() => {
    if (query) {
      searchMovies();
    } else {
      fetchRandomMovies();
    }
  }, [query, searchMovies, fetchRandomMovies, location.pathname]);

  return (
    <div className="films-page">
      {watchlistMovies.length > 0 && !query && (
        <>
          <h1 className="films-title">Your Watchlist</h1>
          <div className="films-row">
            {watchlistMovies.map((movie) => (
              <div
                className="film-card"
                key={movie.imdbID}
                onClick={() => navigate(`/films/${movie.imdbID}`)}
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : ""}
                  alt={movie.Title}
                  className="film-poster"
                />
                <div className="film-info">
                  <h5>{movie.Title}</h5>
                  <p>{movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h1 className="films-title">
        {query ? `Search Results for "${query}"` : "Top Picks for You"}
      </h1>

      {movies.length > 0 ? (
        <div className="films-row">
          {movies.map((movie) => {
            const isRatedR = movie.Rated === "R";
            const isRevealed = revealedRMovies.has(movie.imdbID);

            const handleClick = () => {
              // block click if R and not confirmed
              if (isRatedR && !isRevealed) return;
              navigate(`/films/${movie.imdbID}`);
            };

            return (
              <div
                className={`film-card ${
                  isRatedR && !isRevealed ? "restricted-card" : ""
                }`}
                key={movie.imdbID}
                onClick={handleClick}
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : ""}
                  alt={movie.Title}
                  className={`film-poster ${
                    isRatedR && !isRevealed ? "blurred-poster" : ""
                  }`}
                />

                {isRatedR && !isRevealed && (
                  <div className="rated-r-overlay">
                    <p>18+ Restricted</p>
                    <button
                      className="reveal-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRevealR(movie.imdbID);
                      }}
                    >
                      I am 18+
                    </button>
                  </div>
                )}

                <div className="film-info">
                  <h5>{movie.Title}</h5>
                  <p>{movie.Year}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: "white", marginTop: "20px" }}>No movies found.</p>
      )}
    </div>
  );
};

export default MovieListDetail;