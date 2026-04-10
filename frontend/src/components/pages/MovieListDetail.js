import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/filmsPage.css";


// List of highly rated movies (IMDB IDs)
const topMovieIDs = [
  "tt0111161", // Shawshank Redemption
  "tt0068646", // The Godfather
  "tt0071562", // The Godfather Part II
  "tt0468569", // The Dark Knight
  "tt0050083", // 12 Angry Men
  "tt0108052", // Schindler's List
  "tt0167260", // LOTR: Return of the King
  "tt0110912", // Pulp Fiction
  "tt0137523", // Fight Club
  "tt0120737", // LOTR: Fellowship of the Ring
  "tt0109830", // Forrest Gump
  "tt1375666", // Inception
  "tt0816692", // Interstellar
  "tt0133093", // The Matrix
  "tt0080684", // Empire Strikes Back
  "tt0073486", // One Flew Over the Cuckoo's Nest
  "tt0099685", // Goodfellas
  "tt0114369", // Se7en
  "tt0047478", // Seven Samurai
  "tt0317248", // City of God
];

const MovieListDetail = () => {
  const [movies, setMovies] = useState([]);
  const [watchlistMovies,] = useState([]); // <-- ADDED
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  // eslint-disable-next-line no-unused-vars
  const user = useContext(UserContext); // kept for future use
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("search") || "";

  // Fetch random top rated movies when no search is active
  const fetchRandomTopMovies = useCallback(async () => {
    try {
      const shuffled = [...topMovieIDs].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);

      const results = await Promise.all(
        selected.map(async (id) => {
          const res = await fetch(
            `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
          );
          return res.json();
        })
      );

      setMovies(results);
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
      setMovies(data.Search || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }, [query, API_KEY]);

 
  // Reload movies every time Films tab is entered
  useEffect(() => {
    if (query) {
      searchMovies();
    } else {
      fetchRandomTopMovies();
    }

   
  }, [
    query,
    searchMovies,
    fetchRandomTopMovies,

    location.pathname,
  ]);

  return (
    <div className="films-page">
      {/* Watchlist Section (ADDED) */}
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
        {query ? `Search Results for "${query}"` : "Top Picks For You"}
      </h1>

      {movies.length > 0 ? (
        <div className="films-row">
          {movies.map((movie) => (
            <div
              className="film-card"
              key={movie.imdbID}


              // MOVIE NAVIGATION TO INDIVIDUAL PAGE



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
      ) : (
        <p style={{ color: "white", marginTop: "20px" }}>No movies found.</p>
      )}
    </div>
  );
};

export default MovieListDetail;