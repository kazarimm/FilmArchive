import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import "../../css/watchlistCard.css";
import {  useNavigate } from "react-router-dom";

const WatchlistCard = ({ film, watchedStatus, onRemove, onToggleWatchedStatus}) => {
  const [movie, setMovie] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonMessage = film.watchedStatus ? "Mark as Unwatched" : "Mark as Watched";
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?i=${film.imdbID}&apikey=${API_KEY}`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [film.imdbID, API_KEY]);

  //click outside menu to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

 //Click esc to exit menu
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="film-card">

      {/* MENU WRAPPER */}
      <div ref={menuRef}>

        {/* GEAR BUTTON */}
        <button
          className={`film-menu-button ${menuOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          <FaCog />
        </button>

        {/* DROPDOWN */}
        {menuOpen && (
          <div className="film-dropdown">
            <button
              onClick={() => {
                onRemove(film.imdbID);
                setMenuOpen(false);
              }}
            >
              Remove from Watchlist
            </button>

            <button onClick={() => {
              onToggleWatchedStatus(film.imdbID, film.watchedStatus);
              setMenuOpen(false);
            }}>{buttonMessage}</button>
          </div>
        )}

      </div>

      {/* POSTER */}
      <img
        onClick={() => navigate(`/films/${movie.imdbID}`)}
        src={movie.Poster !== "N/A" ? movie.Poster : ""}
        alt={movie.Title}
        className="film-poster"
      />

      {/* INFO */}
      <div className="film-info">
        <h5>{movie.Title}</h5>
        <p>{movie.Year}</p>
      </div>
    </div>
  );
};

export default WatchlistCard;