import React, { useEffect, useState } from "react";

const ReviewItem = ({ review }) => {
  const [movie, setMovie] = useState(null);
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?i=${review.imdbID}&apikey=${API_KEY}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };

    fetchMovie();
  }, [review.imdbID, API_KEY]);

  return (
    <div className="review-item">
      <p className="review-content">“{review.content}”</p>

      <p className="review-movie">
        Movie: {movie?.Title || review.imdbID}
      </p>

      <p className="review-date">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ReviewItem;