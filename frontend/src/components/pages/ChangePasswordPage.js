import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import "../../css/changePasswordPage.css";

const ChangePasswordPage = () => {
  const [, setUser] = useState({});
  const [dbUserId, setDbUserId] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const decodedUser = getUserInfo();
    setUser(decodedUser);

    if (decodedUser) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getAll`)
        .then((res) => {
          const matchedUser = res.data.find(
            (u) =>
              u.username === decodedUser.username ||
              u.email === decodedUser.email
          );

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      if (!dbUserId) {
        setMessage("User not found.");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/changePassword/${dbUserId}`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }
      );

      setMessage("Password changed successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h1>Change Password</h1>
        <p>Update your account password securely.</p>

        <form onSubmit={handlePasswordChange}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <div className="change-password-buttons">
            <button type="submit">Update Password</button>
            <button
              type="button"
              onClick={() => navigate("/privateUserProfile")}
            >
              Back
            </button>
          </div>
        </form>

        {message && <p className="password-message">{message}</p>}
      </div>
    </div>
  );
};

export default ChangePasswordPage;