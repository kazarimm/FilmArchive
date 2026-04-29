import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";
import "../../css/privateUserProfile.css";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const decodedUser = getUserInfo();
    setUser(decodedUser);

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
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

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

  if (!user) {
    return (
      <div className="profile-page">
        <h3 className="login-warning">Log in to view this page.</h3>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* TOP BAR (now empty / clean) */}
      <div className="profile-topbar"></div>

      {/* MAIN CONTENT */}
      <div className="profile-wrapper">

        <div className="profile-card">
          <div className="profile-left">
            <div className="profile-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="profile-info">
              <h1>{user.username}</h1>
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
              Edit Profile
            </button>

            <button
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

        <Modal.Body>
          Are you sure you want to log out?
        </Modal.Body>

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