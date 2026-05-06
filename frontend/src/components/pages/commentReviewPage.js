import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentReviewPage = () => {
  const [flags, setFlags] = useState([]);
  const [message, setMessage] = useState(""); // ✅ NEW

  useEffect(() => {
    fetchFlagsWithComments();
  }, []);

  const fetchFlagsWithComments = async () => {
    try {
      const res = await axios.get("http://localhost:8081/commentFlags/getAll");

      const pendingFlags = res.data.filter(f => f.reviewStatus === "pending");

      const updatedFlags = await Promise.all(
        pendingFlags.map(async (flag) => {
          try {
            const commentRes = await axios.get(
              `http://localhost:8081/comments/bycommentid/${flag.commentId}`
            );

            return {
              ...flag,
              comment: commentRes.data
            };
          } catch {
            return { ...flag, comment: null };
          }
        })
      );

      setFlags(updatedFlags);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnflag = async (flagId) => {
  try {
    const res = await axios.put(
      `http://localhost:8081/commentFlags/unflag/${flagId}`
    );

    if (res.status === 200) {
      setFlags((prev) => prev.filter((f) => f._id !== flagId));

      setMessage("Successfully unflagged comment");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }

  } catch (err) {
    console.error("Unflag error:", err);

    setMessage("Failed to unflag comment");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }
};

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h2 style={{ color: "red" }}>Comment Review Page</h2>

      {/* ✅ SUCCESS MESSAGE */}
      {message && (
        <p style={{ color: "limegreen", marginBottom: "15px" }}>
          {message}
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {flags.map((flag) => (
          <div
            key={flag._id}
            style={{
              border: "1px solid red",
              borderRadius: "10px",
              padding: "15px",
              width: "300px",
              boxShadow: "0 0 10px rgba(255,0,0,0.4)",
              backgroundColor: "#1a1a1a"
            }}
          >
            <p><strong style={{ color: "red" }}>Comment ID:</strong> {flag.commentId}</p>

            <p>
              <strong style={{ color: "red" }}>Comment:</strong><br />
              {flag.comment ? flag.comment[0].content : "Comment not found"}
            </p>

            <p><strong style={{ color: "red" }}>Reason:</strong> {flag.reason}</p>

            <p>
              <strong style={{ color: "red" }}>Status:</strong> {flag.reviewStatus}
            </p>

            <button
              onClick={() => handleUnflag(flag.commentId)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Unflag
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentReviewPage;