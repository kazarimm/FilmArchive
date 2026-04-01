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

    if (!movie) return <div className="card">Loading...</div>;
  return (
    <div className="card">
        <img
            src={movie.Poster !== "N/A" ? movie.Poster : ""}
            alt={movie.Title}
            className="card-img"
        />
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
        {movie && (
        <span className={`status-badge ${watchedStatus ? "watched" : "not-watched"}`}>
        {watchedStatus ? "Watched" : "Not Watched"}
        
        </span>
)}
    </div>
  );
};

export default WatchlistCard;