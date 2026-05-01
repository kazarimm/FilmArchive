import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";
import "../../css/privateUserProfile.css";
import FavoriteMovieCard from "./FavoriteMovieCard";
import ReviewItem from "./ReviewItem";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [likedMovies, setLikedMovies] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [topGenres, setTopGenres] = useState([]);

  const [stats, setStats] = useState({
    reviews: 0,
    favorites: 0,
    watchlist: 0
  });

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const loadProfileStats = async (dbUserId) => {
    try {
      const watchlistRes = await axios.get(
        `http://localhost:8081/watchlist/${dbUserId}`
      );

      const commentsRes = await axios.get(
        `http://localhost:8081/comments/user/${dbUserId}`
      );

      const films = watchlistRes.data.films || [];
      const userComments = commentsRes.data || [];

      const likedMoviesList = films.filter((film) => film.liked === true);

      setLikedMovies(likedMoviesList);
      setUserReviews(userComments);

      setStats({
        reviews: userComments.length,
        favorites: likedMoviesList.length,
        watchlist: films.length
      });

      const movieDetails = await Promise.all(
        films.map(async (film) => {
          const res = await fetch(
            `http://www.omdbapi.com/?i=${film.imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
          );
          return res.json();
        })
      );

      const genreCounts = {};

      movieDetails.forEach((movie) => {
        if (movie.Genre) {
          movie.Genre.split(",").forEach((genre) => {
            const cleanGenre = genre.trim();
            genreCounts[cleanGenre] = (genreCounts[cleanGenre] || 0) + 1;
          });
        }
      });

      const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setTopGenres(sortedGenres);
    } catch (error) {
      console.error("Error loading profile stats:", error);

      setLikedMovies([]);
      setUserReviews([]);
      setTopGenres([]);

      setStats({
        reviews: 0,
        favorites: 0,
        watchlist: 0
      });
    }
  };

  useEffect(() => {
    const decodedUser = getUserInfo();
<<<<<<< HEAD
    setUser(decodedUser);
=======
>>>>>>> f5ceefbb73ced70026bfca6e2505b7809b54d653

    if (decodedUser) {
      axios
        .get("http://localhost:8081/user/getAll")
        .then((res) => {
          const matchedUser = res.data.find(
            (u) =>
              u.username === decodedUser.username ||
              u.email === decodedUser.email
          );

          if (matchedUser) {
            setUser(matchedUser);
            setBio(matchedUser.bio || "");
            loadProfileStats(matchedUser._id);
          } else {
            setUser(decodedUser);
          }
        })
        .catch((error) => {
          console.error(error);
          setUser(decodedUser);
        });
    }
  }, []);

<<<<<<< HEAD
  const handleSaveBio = async () => {
    try {
      const userId = user._id || user.id || user.userId;

      const res = await axios.put(
        `http://localhost:8081/user/updateBio/${userId}`,
        { bio }
      );

      setUser(res.data);
      setBio(res.data.bio || "");
      setMessage("Bio updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update bio.");
    }
  };

=======
>>>>>>> f5ceefbb73ced70026bfca6e2505b7809b54d653
  if (!user) {
    return (
      <div className="profile-dashboard">
        <h3 className="login-warning">Log in to view this page.</h3>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="profile-page">

      {/* TOP BAR (now empty / clean) */}
      <div className="profile-topbar"></div>

      {/* MAIN CONTENT */}
      <div className="profile-wrapper">

        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-avatar">
=======
    <div className="profile-dashboard">
      <div className="profile-app-header">
        <div className="profile-logo-box">
          <div className="profile-logo">🎞️</div>
          <h2>Film Archive</h2>
        </div>

        <button className="header-logout-btn" onClick={handleShow}>
          Logout
        </button>
      </div>

      <div className="profile-dashboard-content">
        <div className="profile-hero-card">
          <div className="profile-main-info">
            <div className="profile-avatar-modern">
>>>>>>> f5ceefbb73ced70026bfca6e2505b7809b54d653
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <h1>{user.username}</h1>
<<<<<<< HEAD
              <p>{user.email || "No email available"}</p>
              <span>Film Archive Member</span>

              {bio && (
                <p className="saved-bio-preview">{bio}</p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS (logout stays here only) */}
          <div className="profile-actions">
            <button
              className="action-btn"
              onClick={() => navigate("/edit-profile")}
            >
=======
              <p className="profile-email">{user.email}</p>

              <div className="profile-badges">
                <span className="member-badge">Film Archive Member</span>
              </div>

              {bio && <p className="profile-bio-text">{bio}</p>}
            </div>
          </div>

          <div className="profile-action-buttons">
            <button onClick={() => navigate("/edit-profile")}>
>>>>>>> f5ceefbb73ced70026bfca6e2505b7809b54d653
              Edit Profile
            </button>

            <button
<<<<<<< HEAD
              className="action-btn"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>

            <button
              className="action-btn"
              onClick={handleShow}
            >
              Logout
            </button>
          </div>
        </div>

        {/* BIO SECTION */}
        <div className="bio-card">
          <h2>Biography</h2>

          <p className="bio-subtext">
            Add a short biography like your favorite movies, genres, or anything
            you want people to know about you.
          </p>

          <textarea
            className="bio-textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            rows="5"
          />

          <div className="bio-actions">
            <button className="save-bio-btn" onClick={handleSaveBio}>
              Save Bio
            </button>
          </div>

          {message && (
            <p className="status-message">{message}</p>
          )}
        </div>

=======
              className="danger-btn"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="stats-grid three-stats">
          <div
            className="stat-card clickable-card"
            onClick={() => setActiveTab("reviews")}
          >
            <div className="stat-icon orange">⭐</div>
            <h2>{stats.reviews}</h2>
            <p>Reviews Written</p>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => setActiveTab("favorites")}
          >
            <div className="stat-icon red">♡</div>
            <h2>{stats.favorites}</h2>
            <p>Favorites</p>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/watchlist")}
          >
            <div className="stat-icon blue">👁️</div>
            <h2>{stats.watchlist}</h2>
            <p>Watchlist</p>
          </div>
        </div>

        <div className="profile-tabs">
          <span
            className={activeTab === "overview" ? "active-tab" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </span>

          <span
            className={activeTab === "favorites" ? "active-tab" : ""}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites
          </span>

          <span
            className={activeTab === "reviews" ? "active-tab" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </span>
        </div>

        {activeTab === "overview" && (
          <div className="genres-card">
            <h2>Top Genres</h2>

            {topGenres.length === 0 ? (
              <p className="empty-message">No genre data available yet.</p>
            ) : (
              topGenres.map(([genre, count]) => (
                <div className="genre-row" key={genre}>
                  <div className="genre-label">
                    <span>{genre}</span>
                    <span>
                      {count} film{count > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="genre-bar">
                    <div
                      style={{
                        width: `${Math.min(
                          (count / stats.watchlist) * 100,
                          100
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="genres-card">
            <h2>Favorite Movies</h2>

            {likedMovies.length === 0 ? (
              <p className="empty-message">No favorite movies yet.</p>
            ) : (
              <div className="favorites-list">
                {likedMovies.map((film) => (
                  <FavoriteMovieCard key={film.imdbID} imdbID={film.imdbID} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="genres-card">
            <h2>Reviews Written</h2>

            {userReviews.length === 0 ? (
              <p className="empty-message">No reviews written yet.</p>
            ) : (
              <div className="reviews-list">
                {userReviews.map((review) => (
                  <ReviewItem key={review._id} review={review} />
                ))}
              </div>
            )}
          </div>
        )}
>>>>>>> f5ceefbb73ced70026bfca6e2505b7809b54d653
      </div>

      {/* MODAL */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>

<<<<<<< HEAD
        <Modal.Body>
          Are you sure you want to log out?
        </Modal.Body>
=======
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
>>>>>>> f5ceefbb73ced70026bfca6e2505b7809b54d653

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button variant="danger" onClick={handleLogout}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default PrivateUserProfile;