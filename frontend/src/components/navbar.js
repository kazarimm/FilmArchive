import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ReactNavbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [, setUser] = useState({});
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
        );
        const data = await res.json();

        if (data.Search) {
          setSuggestions(data.Search.slice(0, 6)); // top 6 matches
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (err) {
        console.error(err);
      }
    }, 300); // debounce delay

    return () => clearTimeout(delay);
  }, [query, API_KEY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/movies?search=${encodeURIComponent(query)}`);
    setQuery("");
    setShowDropdown(false);
  };

  const handleSuggestionClick = (movie) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/films/${movie.imdbID}`);
  };

  return (
    <ReactNavbar bg="dark" variant="dark" className="custom-navbar">
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/">Start</Nav.Link>
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          <Nav.Link href="/movies">Films</Nav.Link>
          <Nav.Link href="/watchlist">Watchlist</Nav.Link>
        </Nav>

        <Form className="d-flex position-relative" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Search films..."
            className="me-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
          />
          <Button variant="outline-light" type="submit">
            Search
          </Button>

          {showDropdown && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((movie) => (
                <div
                  key={movie.imdbID}
                  className="search-dropdown-item"
                  onMouseDown={() => handleSuggestionClick(movie)}
                >
                  <img
                    src={movie.Poster !== "N/A" ? movie.Poster : ""}
                    alt={movie.Title}
                    className="search-dropdown-poster"
                  />
                  <div>
                    <div className="search-dropdown-title">{movie.Title}</div>
                    <div className="search-dropdown-year">{movie.Year}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Form>
      </Container>
    </ReactNavbar>
  );
}