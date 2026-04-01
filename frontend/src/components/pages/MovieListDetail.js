import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../../App"; 
import { useLocation } from "react-router-dom";
import "../../css/movielistdetail.css";
import getUserInfo from '../../utilities/decodeJwt';

// Default movies to show on the Films tab
const defaultMovies = [
  {
    Title: "Fight Club",
    Year: "1999",
    imdbID: "tt0137523",
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
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  const user = useContext(UserContext);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("search") || "";

  // Memoized search function
  const searchMovies = useCallback(async () => {
    if (!query) return;
    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
      const data = await res.json();
      setMovies(data.Search || []);
      setSelectedMovie(null);
    } catch (err) {
      console.error(err);
    }
  }, [query, API_KEY]);

  useEffect(() => {
    if (query) searchMovies();
  }, [query, searchMovies]);

  const fetchMovieDetail = async (imdbID) => {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    const data = await res.json();
    setSelectedMovie(data);
    loadComments(imdbID);
  };

  const loadComments = async (imdbID) => {
    try {
      const res = await axios.get(`/api/comments/${imdbID}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };





  /// FUNCTION THAT ADDS A MOVIE TO THE WATCHLIST
  async function addToWatchlist(imdbID) {
  try {
    const accessToken = localStorage.getItem("accessToken");
        const user = getUserInfo(accessToken);
        console.log("User Info:", user);
        const userId = user.id;
        console.log("User ID:", userId);

    const response = await fetch(`http://localhost:8081/watchlist/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        imdbID: imdbID,
        watchedStatus: false
      }),
    });

    const data1 = await response.json();
    console.log("Added to watchlist:", data1);

  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
}




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

  // Component to post a reply to a comment
  const ReplyInput = ({ parentId }) => {
    const [replyText, setReplyText] = useState("");

    const handlePostReply = async () => {
      if (!replyText) return;
      try {
        await axios.post("/api/comments", {
          imdbID: selectedMovie.imdbID,
          username: user.username,
          text: replyText,
          parentId: parentId, // links the reply to the parent comment
        });
        setReplyText("");
        loadComments(selectedMovie.imdbID); // refresh comments
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="mt-2">
        <input
          type="text"
          className="form-control"
          placeholder="Reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button className="btn btn-sm btn-primary mt-1" onClick={handlePostReply}>
          Reply
        </button>
      </div>
    );
  };

  // Recursive function to render comments and their replies
  const renderComment = (comment) => {
    return (
      <div key={comment._id} className={`comment-box ${comment.parentId ? "comment-reply" : ""}`}>
        <strong>{comment.username}:</strong> {comment.text}

        {/* Reply input */}
        {user && <ReplyInput parentId={comment._id} />}

        {/* Render replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4 text-center">
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

      {selectedMovie && (
  <div className="movie-detail-page">
    {/* Blurred background poster */}
    <div
      className="movie-detail-bg"
      style={{ backgroundImage: `url(${selectedMovie.Poster})` }}
    />

    {/* Foreground overlay */}
    <div className="movie-detail-overlay">
      <div className="movie-info">
        <button
          className="btn btn-secondary mb-3"
          onClick={() => setSelectedMovie(null)}
        >
          Back to Results
        </button>


        <div className="mt-2">
          <button onClick={() => addToWatchlist(selectedMovie.imdbID)}>
            Add to Watchlist
          </button>
        </div>




        <h1>{selectedMovie.Title}</h1>

        <img
          src={selectedMovie.Poster}
          alt={selectedMovie.Title}
          className="front-poster"
        />

        <p><strong>Year:</strong> {selectedMovie.Year}</p>
        <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
        <p><strong>Director:</strong> {selectedMovie.Director}</p>
        <p><strong>Plot:</strong> {selectedMovie.Plot}</p>

        <div className="comments-section">
          <h4>Comments</h4>

          {comments.map((c) => renderComment(c))}

          {user ? (
            <>
              <input
                type="text"
                className="form-control mt-3"
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
    </div>
  </div>

        
      )}
    </div>
  );
};

export default MovieListDetail;