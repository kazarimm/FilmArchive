import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../../App";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/moviedetailpage.css";
// eslint-disable-next-line no-unused-vars
import getUserInfo from "../../utilities/decodeJwt";

const MovieDetailPage = () => {
  const { imdbID } = useParams();
  const user = useContext(UserContext);

  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [collapsedThreads, setCollapsedThreads] = useState({});

  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  const toggleThread = (commentId) => {
    setCollapsedThreads((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }

  const loadComments = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8081/comments/${imdbID}`);
      const allComments = Array.isArray(res.data) ? res.data : [];
      setComments(allComments);
    } catch (err) {
      console.error("Error loading comments:", err);
      setComments([]);
    }
  }, [imdbID]);

  const loadWatchlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:8081/watchlist/${user.id}`);
      setWatchlist(res.data.films || []);
    } catch (err) {
      console.error("Error loading watchlist:", err);
      setWatchlist([]);
    }
  }, [user]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!API_KEY) {
        setError("OMDB API key is missing!");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
        const data = await res.json();
        if (data.Response === "False") setError(data.Error || "Failed to fetch movie details.");
        else setSelectedMovie(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
    loadComments();
    loadWatchlist();
  }, [imdbID, API_KEY, loadComments, loadWatchlist]);

  const decideWatchlistAction = () => {
    if (isInWatchlist()) {
      removeFromWatchlist();
    } else {
      addToWatchlist();
    }
  };
  const addToWatchlist = async () => {
    if (!user) return alert("You must be logged in!");
    try {
      await axios.post("http://localhost:8081/watchlist/add", {
        userId: user.id,
        imdbID: selectedMovie.imdbID,
        watchedStatus: false,
      });
      alert("Added to watchlist!");
      loadWatchlist();
    } catch (err) {
      console.error(err);
      alert("Failed to add to watchlist.");
    }
  };

  const removeFromWatchlist = async () => {
    if (!user) return alert("You must be logged in!");
    try {
      await axios.delete(`http://localhost:8081/watchlist/remove/${user.id}/${selectedMovie.imdbID}`);
      alert("Removed from watchlist!");
      loadWatchlist();
    } catch (err) {
      console.error(err);
      alert("Failed to remove from watchlist.");
    }
  };

  const isInWatchlist = () => watchlist.some(f => f.imdbID === imdbID);

  const postComment = async (parentCommentId = null) => {
    if (!newComment.trim()) return;
    if (!user) return alert("You must be logged in to comment.");

    try {
      await axios.post("http://localhost:8081/comments/create", {
        imdbID,
        userId: user.id,
        username: user.username,
        content: newComment,
        parentCommentId,
      });
      setNewComment("");
      loadComments();
    } catch (err) {
      console.error(err);
      alert("Failed to post comment.");
    }
  };

  const buildCommentTree = (allComments) => {
  const map = {};
  allComments.forEach(c => (map[c._id] = { ...c, replies: [] }));

  const tree = [];

  allComments.forEach(c => {
    if (c.parentCommentId && map[c.parentCommentId]) {
      map[c.parentCommentId].replies.push(map[c._id]);
    } else {
      tree.push(map[c._id]);
    }
  });

  return tree;
};

const renderComments = (commentList, depth = 0) =>
    commentList.map((c) => {
      const isCollapsed = collapsedThreads[c._id];

      return (
        <div key={c._id} className="comment-thread">

          <div className="comment-row" style={{ marginLeft: depth * 24 }}>

            {depth > 0 && <div className="thread-line" />}

            <div className="comment-body">

              <div className="comment-meta">
                <strong>{c.username}</strong>
              </div>

              <p className="comment-content">{c.content}</p>

              {c.replies?.length > 0 && (
                <button
                  className="toggle-replies-btn"
                  onClick={() => toggleThread(c._id)}
                >
                  {isCollapsed
                    ? `Show replies (${c.replies.length})`
                    : `Hide replies (${c.replies.length})`}
                </button>
              )}

              {user && (
                <div className="reply-form">
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Reply..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        postComment(c._id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {!isCollapsed && c.replies?.length > 0 && (
            <div className="replies-container">
              {renderComments(c.replies, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  if (loading) return <p className="text-center mt-5 text-white">Loading movie...</p>;
  if (error) return <p className="text-center mt-5 text-white">{error}</p>;
  if (!selectedMovie) return null;

  return (
    <div className="movie-detail-page">
      <div className="navbar"></div>

      <div
        className="movie-detail-bg"
        style={{
          backgroundImage:
            selectedMovie.Poster && selectedMovie.Poster !== "N/A"
              ? `url(${selectedMovie.Poster})`
              : "none",
        }}
      />

      <div className="movie-detail-overlay">
      <button
          className="back-btn"
          onClick={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate("/");
          }}
        >
          ← Return to Previous Page
        </button>
        <div className="movie-info">
          <h1>{selectedMovie.Title}</h1>
          <div className="movie-detail-flex">
            {selectedMovie.Poster && selectedMovie.Poster !== "N/A" && (
              <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="front-poster" />
            )}
            <div className="movie-detail-text">
              <p><strong>Year:</strong> {selectedMovie.Year}</p>
              <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
              <p><strong>Director:</strong> {selectedMovie.Director}</p>
              <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
              {user && (
                <div className="watchlist-container">
                  <button
                    className="add-watchlist-btn"
                    onClick={decideWatchlistAction}
                  >
                    {isInWatchlist() ? "In Watchlist" : "Add to Watchlist"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="comments-section">
            <h3>Comments</h3>
            {user ? (
              <div className="comment-form">
                <input
                  type="text"
                  className="comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  onKeyDown={(e) => { if (e.key === "Enter") postComment(); }}
                />
                <button className="comment-submit-btn" onClick={() => postComment()}>Post</button>
              </div>
            ) : (
              <p className="login-prompt">Log in to post comments.</p>
            )}

            <div className="comments-list">{renderComments(buildCommentTree(comments))}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;