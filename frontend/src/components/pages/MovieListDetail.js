import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import imdbIDs from "../../data/imdb_ids_us_recent.json";
import "../../css/filmsPage.css";

const MovieListDetail = ({ embedded = false }) => {
  const [movies, setMovies] = useState(null);
  const [revealedRMovies, setRevealedRMovies] = useState(new Set());

  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  const navigate = useNavigate();
  const { search } = useLocation();

  const query = new URLSearchParams(search).get("search") || "";

  const toggleRevealR = (imdbID) => {
    setRevealedRMovies((prev) => {
      const newSet = new Set(prev);
      newSet.add(imdbID);
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

  const getRandomIDs = (count) => {
    const shuffled = [...imdbIDs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const fetchRandomMovies = useCallback(async () => {
    try {
      setMovies(null);

      let collectedMovies = [];
      let attempts = 0;

      while (collectedMovies.length < 25 && attempts < 10) {
        attempts++;

        const selectedIDs = getRandomIDs(40);

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

        collectedMovies = collectedMovies.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.imdbID === movie.imdbID)
        );
      }

      setMovies(collectedMovies.slice(0, 25));
    } catch (err) {
      console.error("Failed to load random movies:", err);
      setMovies([]);
    }
  }, [API_KEY]);

  const searchMovies = useCallback(async () => {
    if (!query) return;

    try {
      setMovies(null);

      const res = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (!data.Search || data.Response === "False") {
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
      setMovies([]);
    }
  }, [query, API_KEY]);

  useEffect(() => {
    if (query) {
      searchMovies();
    } else {
      fetchRandomMovies();
    }
  }, [query, searchMovies, fetchRandomMovies]);

  const isLoading = movies === null;
  const isEmpty = movies && movies.length === 0;

  return (
    <div
      className={`films-page text-white min-h-screen ${
        embedded ? "" : "bg-black"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400 animate-pulse">
            Loading movies...
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400">No films found</div>
        </div>
      ) : (
        <>
          <h1 className="films-title">
            {query ? `Search Results for "${query}"` : "Top Picks for You"}
          </h1>

          <div className="films-row">
            {movies.map((movie) => {
              const isRatedR = movie.Rated === "R";
              const isRevealed = revealedRMovies.has(movie.imdbID);

              const handleClick = () => {
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
        </>
      )}
    </div>
  );
};

export default MovieListDetail;