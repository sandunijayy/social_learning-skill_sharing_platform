// "use client";

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { useToast } from "../../contexts/ToastContext";
// import axios from "../../utils/axios-utils";
// import "./FeedbackPages.css";

// const FeedbacksPage = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { currentUser, isAuthenticated } = useAuth();
//   const { showToast } = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login"); // NEW: Redirect if not authenticated
//       return;
//     }
//     fetchFeedbacks();
//   }, [isAuthenticated, navigate]);

//   const fetchFeedbacks = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/feedbacks/user");
//       setFeedbacks(response.data.data);
//     } catch (error) {
//       console.error("Error fetching feedbacks:", error);
//       const errorMessage = error.response?.data?.message || "Failed to load feedbacks";
//       showToast("error", errorMessage);
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         navigate("/login"); // NEW: Redirect on auth error
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateFeedback = () => {
//     navigate("/feedbacks/create");
//   };

//   const handleEditFeedback = (id) => {
//     navigate(`/feedbacks/${id}/edit`);
//   };

//   const handleDeleteFeedback = async (id) => {
//     if (window.confirm("Are you sure you want to delete this feedback?")) {
//       try {
//         await axios.delete(`/api/feedbacks/${id}`);
//         showToast("success", "Feedback deleted successfully");
//         fetchFeedbacks();
//       } catch (error) {
//         console.error("Error deleting feedback:", error);
//         showToast("error", error.response?.data?.message || "Failed to delete feedback");
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const renderStars = (rating) => {
//     return Array(5)
//       .fill(0)
//       .map((_, index) => (
//         <i
//           key={index}
//           className="material-icons star-icon"
//           style={{ color: index < rating ? "#ffc107" : "#ddd" }}
//         >
//           star
//         </i>
//       ));
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading feedbacks...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="feedback-container">
//       <div className="feedback-header">
//         <h1 className="feedback-title">My Feedbacks</h1>
//         <button className="create-feedback-btn" onClick={handleCreateFeedback}>
//           <i className="material-icons">add</i>
//           <span>Add Feedback</span>
//         </button>
//       </div>

//       {feedbacks.length === 0 ? (
//         <div className="empty-feedback">
//           <i className="material-icons empty-feedback-icon">feedback</i>
//           <p className="empty-feedback-text">You haven't provided any feedback yet.</p>
//           <button className="create-feedback-btn" onClick={handleCreateFeedback}>
//             <i className="material-icons">add</i>
//             <span>Add Your First Feedback</span>
//           </button>
//         </div>
//       ) : (
//         <div className="feedback-list">
//           {feedbacks.map((feedback) => (
//             <div key={feedback.id} className="feedback-card">
//               <div className="feedback-card-header">
//                 <h2 className="feedback-card-title">{feedback.title}</h2>
//                 <div className="feedback-card-rating">{renderStars(feedback.rating)}</div>
//               </div>
//               <p className="feedback-card-content">{feedback.content}</p>
//               <div className="feedback-card-footer">
//                 <div className="feedback-card-date">
//                   {formatDate(feedback.createdAt)}
//                   {feedback.updatedAt !== feedback.createdAt && " (edited)"}
//                 </div>
//                 <div className="feedback-card-actions">
//                   <button
//                     className="feedback-action-btn edit-btn"
//                     onClick={() => handleEditFeedback(feedback.id)}
//                   >
//                     <i className="material-icons">edit</i>
//                   </button>
//                   <button
//                     className="feedback-action-btn delete-btn"
//                     onClick={() => handleDeleteFeedback(feedback.id)}
//                   >
//                     <i className="material-icons">delete</i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeedbacksPage;




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
  const { currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to /login");
      navigate("/login");
      return;
    }
    fetchFeedbacks();
  }, [isAuthenticated, navigate]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching feedbacks for user:", currentUser?.username);
      const response = await feedbackAPI.getUserFeedbacks();
      console.log("Feedbacks response:", response.data);
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
          : error.response?.status === 403
          ? "You don't have permission to view feedback. Please contact support."
          : error.response?.data?.message || "Failed to load feedbacks";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeedback = () => {
    navigate("/feedbacks/create");
  };

  const handleEditFeedback = (id) => {
    navigate(`/feedbacks/${id}/edit`);
  };

  const handleDeleteFeedback = async (id) => {
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