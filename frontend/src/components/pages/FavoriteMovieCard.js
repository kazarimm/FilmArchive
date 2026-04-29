import React, { useEffect, useState } from "react";

const FavoriteMovieCard = ({ imdbID }) => {
  const [movie, setMovie] = useState(null);
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };

    fetchMovie();
  }, [imdbID, API_KEY]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="favorite-movie-card">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : ""}
        alt={movie.Title}
      />
      <p>{movie.Title}</p>
    </div>
  );
};

export default FavoriteMovieCard;