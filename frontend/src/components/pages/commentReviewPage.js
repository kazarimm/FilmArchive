import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentReviewPage = () => {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const res = await axios.get("http://localhost:8081/commentFlags/getAll");
      setFlags(res.data);
    } catch (error) {
      console.error("Error fetching flags:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Comment Review Page</h2>

      <h3>Flagged Comments</h3>

      {/* Card Container */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {flags.map((flag) => (
          <div
            key={flag._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              width: "250px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff"
            }}
          >
            <p><strong>ID:</strong> {flag._id}</p>
            <p><strong>Comment ID:</strong> {flag.commentId}</p>
            <p><strong>Reason:</strong> {flag.reason}</p>
            <p><strong>Status:</strong> {flag.reviewStatus}</p>
            <p><strong>Created:</strong> {new Date(flag.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentReviewPage;