import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../App"; 
import { useLocation } from "react-router-dom";
import "../../css/movielistdetail.css";

// Default movies to show on the Films tab
const defaultMovies = [
  {
    Title: "Inception",
    Year: "2010",
    imdbID: "tt1375666",
    Poster: "https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg"
  },
  {
    Title: "The Matrix",
    Year: "1999",
    imdbID: "tt0133093",
    Poster: "https://m.media-amazon.com/images/I/51EG732BV3L.jpg"
  },
  {
    Title: "Interstellar",
    Year: "2014",
    imdbID: "tt0816692",
    Poster: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg"
  },
  {
    Title: "The Dark Knight",
    Year: "2008",
    imdbID: "tt0468569",
    Poster: "https://m.media-amazon.com/images/I/51k0qaB+0aL._AC_.jpg"
  },
  {
    Title: "Pulp Fiction",
    Year: "1994",
    imdbID: "tt0110912",
    Poster: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg"
  }
];

const MovieListDetail = () => {
  const [movies, setMovies] = useState(defaultMovies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const API_KEY = "746c44f7";

  const user = useContext(UserContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    if (query) searchMovies();
  }, [query]);

  const searchMovies = async () => {
    if (!query) return;
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await res.json();
    setMovies(data.Search || []);
    setSelectedMovie(null);
  };

  const fetchMovieDetail = async (imdbID) => {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await res.json();
    setSelectedMovie(data);
    loadComments(imdbID);
  };

  // Build threaded comment tree
  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];
    comments.forEach(c => (map[c._id] = { ...c, replies: [] }));
    comments.forEach(c => {
      if (c.parentCommentId) {
        if (map[c.parentCommentId]) map[c.parentCommentId].replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });
    return roots;
  };

  const loadComments = async (imdbID) => {
    try {
      const res = await axios.get(`/api/comments/${imdbID}`);
      const tree = buildCommentTree(res.data);
      setComments(tree);
    } catch (err) {
      console.error(err);
    }
  };

  const postComment = async () => {
    if (!newComment || !user) return;
    try {
      await axios.post("/api/comments", {
        imdbID: selectedMovie.imdbID,
        username: user.username,
        text: newComment,
        parentCommentId: null
      });
      setNewComment("");
      loadComments(selectedMovie.imdbID);
    } catch (err) {
      console.error(err);
    }
  };

  // Recursive comment component
  const Comment = ({ comment, depth = 0 }) => {
    const [replyText, setReplyText] = useState("");

    const postReply = async () => {
      if (!replyText || !user) return;
      try {
        await axios.post("/api/comments", {
          imdbID: comment.filmId,
          username: user.username,
          text: replyText,
          parentCommentId: comment._id
        });
        setReplyText("");
        loadComments(selectedMovie.imdbID);
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div
        className="comment"
        style={{ marginLeft: depth * 20 }}
      >
        <p><strong>{comment.username}</strong>: {comment.text}</p>
        {user && (
          <div className="reply-box">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply..."
              className="form-control mb-1"
            />
            <button className="btn btn-sm btn-outline-primary mb-2" onClick={postReply}>Reply</button>
          </div>
        )}
        {comment.replies.map((r) => (
          <Comment key={r._id} comment={r} depth={depth + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-overlay">
        {!selectedMovie && movies.length > 0 && (
          <div className="row mt-4 text-center">
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

        {selectedMovie && (
          <div className="movie-info text-center">
            <button className="btn btn-secondary mb-3" onClick={() => setSelectedMovie(null)}>
              Back to Results
            </button>
            <h1>{selectedMovie.Title}</h1>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="front-poster"/>
            <p><strong>Year:</strong> {selectedMovie.Year}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>

            <div className="comments-section mt-4 text-left">
              <h4>Comments</h4>
              {comments.length === 0 && <p>No comments yet.</p>}
              {comments.map((c) => <Comment key={c._id} comment={c} />)}

              {user && (
                <div className="mt-3">
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
                </div>
              )}
              {!user && <p>Log in to post comments.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListDetail;