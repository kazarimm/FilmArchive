import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import "../../css/editProfilePage.css";

const EditProfilePage = () => {
  const [user, setUser] = useState({});
  const [dbUserId, setDbUserId] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const decodedUser = getUserInfo();
    console.log("Decoded JWT user:", decodedUser);
  
    setUser(decodedUser);
  
    if (decodedUser) {
      setFormData({
        username: decodedUser.username || "",
        email: decodedUser.email || "",
        bio: decodedUser.bio || ""
      });
  
      axios
        .get("http://localhost:8081/user/getAll")
        .then((res) => {
          console.log("All users from DB:", res.data);
  
          const matchedUser = res.data.find(
            (u) =>
              u.username === decodedUser.username ||
              u.email === decodedUser.email
          );
  
          console.log("Matched user:", matchedUser);
  
          if (matchedUser) {
            setDbUserId(matchedUser._id);
          } else {
            setMessage("User not found.");
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage("Failed to load user information.");
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!dbUserId) {
        setMessage("User not found.");
        return;
      }

      await axios.put(
        `http://localhost:8081/user/updateProfile/${dbUserId}`,
        formData
      );

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h1>Edit Profile</h1>
        <p>Update your personal information in Film Archive.</p>

        <form onSubmit={handleSave}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Biography</label>
          <textarea
            name="bio"
            rows="5"
            value={formData.bio}
            onChange={handleChange}
          />

          <div className="edit-profile-buttons">
            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={() => navigate("/privateUserProfile")}
            >
              Back
            </button>
          </div>
        </form>

        {message && <p className="edit-message">{message}</p>}
      </div>
    </div>
  );
};

export default EditProfilePage;