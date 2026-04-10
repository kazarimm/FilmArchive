import React from "react";
import "../../css/watchlistCard.css";

const WatchlistCard = ({ film, watchedStatus}) => {
    const [movie, setMovie] = React.useState(film);
    const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
    React.useEffect(() => {
      const fetchMovieData = async () => {
        try {
          const response = await fetch(`http://www.omdbapi.com/?i=${film.imdbID}&apikey=${API_KEY}`);
          const data = await response.json();
          setMovie(data);
        } catch (error) {
          console.error("Error fetching movie data:", error);
        }
      };
      fetchMovieData();
    }, [film.imdbID, API_KEY]);

    if (!movie) return <div className="front-poster">Loading...</div>;
  return (
  <div className="film-card">
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
);
};

export default WatchlistCard;