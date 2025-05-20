"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../contexts/ToastContext"
import axios from "../../utils/axios-utils"
import "./FeedbackPages.css"

const CreateFeedbackPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 0,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating,
    })
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required"
    } else if (formData.content.length < 10) {
      newErrors.content = "Content must be at least 10 characters"
    }

    if (formData.rating < 1) {
      newErrors.rating = "Please select a rating"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setSubmitting(true)
      await axios.post("/api/feedbacks", formData)
      showToast("success", "Feedback submitted successfully")
      navigate("/feedbacks")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      showToast("error", "Failed to submit feedback")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/feedbacks")
  }

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1 className="feedback-title">Create Feedback</h1>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for your feedback"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`material-icons rating-star ${formData.rating >= star ? "active" : ""}`}
                onClick={() => handleRatingClick(star)}
              >
                star
              </i>
            ))}
          </div>
          {errors.rating && <div className="error-message">{errors.rating}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts, suggestions, or experiences..."
          ></textarea>
          {errors.content && <div className="error-message">{errors.content}</div>}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateFeedbackPage
