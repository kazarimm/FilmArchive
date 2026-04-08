import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentReviewPage = () => {
  const [flags, setFlags] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState(null);

  // Fetch all flags
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

  // Get single flag by ID
  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8081/commentFlags/getById/${id}`);
      setSelectedFlag(res.data);
    } catch (error) {
      console.error("Error fetching flag:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Comment Review Page</h2>

      {/* List of flags */}
      <h3>Flagged Comments</h3>
      <ul>
        {flags.map((flag) => (
          <li key={flag._id}>
            <strong>Comment ID:</strong> {flag.commentId} <br />
            <strong>Reason:</strong> {flag.reason} <br />
            <button onClick={() => handleSelect(flag._id)}>
              View Details
            </button>
            <hr />
          </li>
        ))}
      </ul>

      {/* Selected flag details */}
      {selectedFlag && (
        <div>
          <h3>Selected Flag Details</h3>
          <p><strong>ID:</strong> {selectedFlag._id}</p>
          <p><strong>Comment ID:</strong> {selectedFlag.commentId}</p>
          <p><strong>Reason:</strong> {selectedFlag.reason}</p>
          <p><strong>Status:</strong> {selectedFlag.reviewStatus}</p>
        </div>
      )}
    </div>
  );
};

export default CommentReviewPage;