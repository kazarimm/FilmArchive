import React, { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../App';
import '../css/comments.css';

const CommentsSection = ({ filmId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useContext(UserContext);


    const fetchComments = useCallback(async () => {
    try {
        setLoading(true);
        const response = await fetch(`http://localhost:8081/comments/${filmId}`);
        const data = await response.json();
        setComments(data);
    } catch (err) {
        console.error('Error fetching comments:', err);
    } finally {
        setLoading(false);
    }
}, [filmId]);

useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('You must be logged in to comment');
            return;
        }

        if (!newComment.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/comments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    userId: user._id,
                    username: user.username,
                    filmId: filmId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setNewComment('');
                fetchComments();
            }
        } catch (err) {
            console.error('Error creating comment:', err);
        }
    };

    const handleVote = async (commentId, voteValue) => {
        if (!user) {
            alert('You must be logged in to vote');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/comments/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: commentId,
                    userId: user._id,
                    value: voteValue,
                }),
            });

            const data = await response.json();
            if (data.success) {
                fetchComments();
            }
        } catch (err) {
            console.error('Error voting:', err);
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>

            {/* Add Comment Form */}
            {user && (
                <form onSubmit={handleAddComment} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                        rows="3"
                        className="comment-input"
                    />
                    <button type="submit" className="comment-submit-btn">
                        Post Comment
                    </button>
                </form>
            )}

            {!user && (
                <p className="login-prompt">
                    <a href="/login">Log in</a> to leave a comment
                </p>
            )}

            {/* Comments List */}
            <div className="comments-list">
                {loading && <p>Loading comments...</p>}
                {comments.length === 0 && !loading && <p>No comments yet. Be the first to comment!</p>}

                {comments.map((comment) => (
                    <div key={comment._id} className="comment-card">
                        <div className="comment-header">
                            <strong className="comment-author">{comment.username}</strong>
                            <span className="comment-date">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <p className="comment-content">{comment.content}</p>

                        <div className="comment-footer">
                            <button
                                className="vote-btn upvote-btn"
                                onClick={() => handleVote(comment._id, 1)}
                                title="Upvote"
                            >
                                👍 Upvote
                            </button>
                            <button
                                className="vote-btn downvote-btn"
                                onClick={() => handleVote(comment._id, -1)}
                                title="Downvote"
                            >
                                👎 Downvote
                            </button>
                            <span className="comment-score">Score: {comment.score || 0}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;