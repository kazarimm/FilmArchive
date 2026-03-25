import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../App"; // get logged-in user

const MovieListDetail = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const API_KEY = "746c44f7";

  const user = useContext(UserContext); // get current user

  // Search movies
  const searchMovies = async () => {
    if (!query) return;
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await res.json();
    setMovies(data.Search || []);
    setSelectedMovie(null); // reset detail view
  };

  // Fetch movie detail
  const fetchMovieDetail = async (imdbID) => {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await res.json();
    setSelectedMovie(data);
    loadComments(imdbID);
  };

  // Load comments for a movie
  const loadComments = async (imdbID) => {
    try {
      const res = await axios.get(`/api/comments/${imdbID}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Post a comment
  const postComment = async () => {
    if (!newComment || !user) return;
    try {
      await axios.post("/api/comments", {
        imdbID: selectedMovie.imdbID,
        username: user.username,
        text: newComment,
      });
      setNewComment("");
      loadComments(selectedMovie.imdbID);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4 text-center">
      {/* Search Box */}
      <h2>Search Movies</h2>
      <input
        className="form-control"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a movie title..."
      />
      <button className="btn btn-primary mt-2" onClick={searchMovies}>
        Search
      </button>

      {/* Movie List */}
      {!selectedMovie && movies.length > 0 && (
        <div className="row mt-4">
          {movies.map((movie) => (
            <div
              className="col-md-3 mb-4"
              key={movie.imdbID}
              style={{ cursor: "pointer" }}
              onClick={() => fetchMovieDetail(movie.imdbID)}
            >
              <div className="card h-100">
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : ""}
                  className="card-img-top"
                  alt={movie.Title}
                />
                <div className="card-body">
                  <h5>{movie.Title}</h5>
                  <p>{movie.Year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movie Detail */}
      {selectedMovie && (
        <div className="mt-4 text-left">
          <button className="btn btn-secondary mb-3" onClick={() => setSelectedMovie(null)}>
            Back to Results
          </button>
          <h1>{selectedMovie.Title}</h1>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
          <p><strong>Year:</strong> {selectedMovie.Year}</p>
          <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
          <p><strong>Director:</strong> {selectedMovie.Director}</p>
          <p><strong>Plot:</strong> {selectedMovie.Plot}</p>

          {/* Comments Section */}
          <div className="mt-4">
            <h4>Comments</h4>
            {comments.map((c) => (
              <div key={c._id} className="border p-2 mb-2">
                <strong>{c.username}:</strong> {c.text}
              </div>
            ))}
            {user ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <button className="btn btn-primary mt-2" onClick={postComment}>
                  Post
                </button>
              </>
            ) : (
              <p>Log in to post comments.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieListDetail;