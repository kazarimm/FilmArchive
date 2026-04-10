import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentReviewPage = () => {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    fetchFlagsWithComments();
  }, []);

  const fetchFlagsWithComments = async () => {
    try {
      // Step 1: Get all flags
      const res = await axios.get("http://localhost:8081/commentFlags/getAll");
      const flagsData = res.data;

      // Step 2: Fetch comments for each flag and attach them
      const updatedFlags = await Promise.all(
        flagsData.map(async (flag) => {
          try {
            const commentRes = await axios.get(
              `http://localhost:8081/comments/${flag.commentId}`
            );

            return {
              ...flag,
              comment: commentRes.data // ✅ attach comment directly
            };
          } catch (err) {
            console.error("Error fetching comment:", err);

            return {
              ...flag,
              comment: null
            };
          }
        })
      );

      // Step 3: Save updated flags
      setFlags(updatedFlags);

    } catch (error) {
      console.error("Error fetching flags:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Comment Review Page</h2>

      <h3>Flagged Comments</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {flags.map((flag) => (
          <div
            key={flag._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              width: "300px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff"
            }}
          >
            <p><strong>Comment ID:</strong> {flag.commentId}</p>

            <p>
              <strong>Comment:</strong><br />
              {flag.comment ? flag.comment.content : "Comment not found"}
            </p>

            <p><strong>Reason:</strong> {flag.reason}</p>
            <p><strong>Status:</strong> {flag.reviewStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentReviewPage;