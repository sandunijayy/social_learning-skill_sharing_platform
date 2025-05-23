

"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { feedbackAPI } from "../../utils/api";
import "./FeedbackPages.css";

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !localStorage.getItem("token")) {
      console.log("User not authenticated or no token, redirecting to /login");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    fetchFeedbacks();
  }, [isAuthenticated, navigate]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackAPI.getUserFeedbacks();
      if (response.data.success) {
        setFeedbacks(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch feedbacks");
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", {
        status: error.response?.status,
        data: error.response?.data || error.message,
      });
      const errorMessage =
        error.response?.status === 401
          ? "Unauthorized request. Please try logging in again."
          : error.response?.data?.message || "Failed to load feedbacks";
      setError(errorMessage);
      showToast("error", errorMessage);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeedback = () => {
    if (!isAuthenticated || !localStorage.getItem("token")) {
      showToast("error", "Please log in to create feedback");
      navigate("/login");
      return;
    }
    navigate("/feedbacks/create");
  };

  const handleEditFeedback = (id) => {
    if (!isAuthenticated || !localStorage.getItem("token")) {
      showToast("error", "Please log in to edit feedback");
      navigate("/login");
      return;
    }
    navigate(`/feedbacks/edit/${id}`);
  };
  ///feedbacks/edit
  const handleDeleteFeedback = async (id) => {
    if (!isAuthenticated || !localStorage.getItem("token")) {
      showToast("error", "Please log in to delete feedback");
      navigate("/login");
      return;
    }
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const response = await feedbackAPI.deleteFeedback(id);
        if (response.data.success) {
          showToast("success", response.data.message || "Feedback deleted successfully");
          fetchFeedbacks();
        } else {
          throw new Error(response.data.message || "Failed to delete feedback");
        }
      } catch (error) {
        console.error("Error deleting feedback:", error);
        showToast("error", error.response?.data?.message || "Failed to delete feedback");
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <i
          key={index}
          className="material-icons star-icon"
          style={{ color: index < rating ? "#ffc107" : "#ddd" }}
        >
          star
        </i>
      ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading feedbacks...</p>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1 className="feedback-title">My Feedbacks</h1>
        <button className="create-feedback-btn" onClick={handleCreateFeedback}>
          <i className="material-icons">add</i>
          <span>Add Feedback</span>
        </button>
      </div>
      {error && (
        <div className="error-message" style={{ color: "red", margin: "1rem 0" }}>
          {error}
        </div>
      )}
      {feedbacks.length === 0 && !error ? (
        <div className="empty-feedback">
          <i className="material-icons empty-feedback-icon">feedback</i>
          <p className="empty-feedback-text">You haven't provided any feedback yet.</p>
          <button className="create-feedback-btn" onClick={handleCreateFeedback}>
            <i className="material-icons">add</i>
            <span>Add Your First Feedback</span>
          </button>
        </div>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-card-header">
                <h2 className="feedback-card-title">{feedback.title}</h2>
                <div className="feedback-card-rating">{renderStars(feedback.rating)}</div>
              </div>
              <p className="feedback-card-content">{feedback.content}</p>
              <div className="feedback-card-footer">
                <div className="feedback-card-date">
                  {formatDate(feedback.createdAt)}
                  {feedback.updatedAt !== feedback.createdAt && " (edited)"}
                </div>
                <div className="feedback-card-actions">
                  <button
                    className="feedback-action-btn edit-btn"
                    onClick={() => handleEditFeedback(feedback.id)}
                  >
                    <i className="material-icons">edit</i>
                  </button>
                  <button
                    className="feedback-action-btn delete-btn"
                    onClick={() => handleDeleteFeedback(feedback.id)}
                  >
                    <i className="material-icons">delete</i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbacksPage;