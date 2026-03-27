import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";


// Here, we display our Navbar
export default function Navbar() {
  // We are pulling in the user's info but not using it for now.
  // Warning disabled: 
  // eslint-disable-next-line
const [user, setUser] = useState({})
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  

  useEffect(() => {
  setUser(getUserInfo())
  }, [])

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    // Redirect to the Movies page with the search query as a URL parameter
    navigate(`/movies?search=${encodeURIComponent(query)}`);
    setQuery(""); // optional: clear input after search
  };
  
  // if (!user) return null   - for now, let's show the bar even not logged in.
  // we have an issue with getUserInfo() returning null after a few minutes
  // it seems.
  return (
    <ReactNavbar bg="dark" variant="dark">
    <Container>
      <Nav className="me-auto">
        <Nav.Link href="/">Start</Nav.Link>
        <Nav.Link href="/home">Home</Nav.Link>
        <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
        <Nav.Link href="/comments">Comments</Nav.Link>
        <Nav.Link href="/movies">Films</Nav.Link>
      </Nav>

       <Form className="d-flex" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Search films..."
            className="me-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="outline-light" type="submit">Search</Button>
        </Form>
    </Container>
  </ReactNavbar>

  );
}