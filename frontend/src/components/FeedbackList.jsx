"use client"

import { useState, useEffect } from "react"
import { StarIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid"
import EditFeedbackModal from "./EditFeedbackModal"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { toast } from "react-toastify"

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)

  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [feedbackToDelete, setFeedbackToDelete] = useState(null)

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/feedback")
      if (!response.ok) {
        throw new Error("Failed to fetch feedback")
      }
      const data = await response.json()
      setFeedbackList(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching feedback:", err)
      setError("Failed to load feedback. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()

    // Listen for refresh events from the form component
    const handleRefresh = () => fetchFeedback()
    window.addEventListener("refreshFeedbackList", handleRefresh)

    return () => {
      window.removeEventListener("refreshFeedbackList", handleRefresh)
    }
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    const options = { year: "numeric", month: "long", day: "numeric" }
    const date = new Date(dateString)

    return date.toLocaleDateString("en-US", options)
  }

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`} />)
  }

  const handleEdit = (feedback) => {
    setCurrentFeedback(feedback)
    setIsEditModalOpen(true)
  }

  const handleDelete = (feedback) => {
    setFeedbackToDelete(feedback)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateSuccess = (updatedFeedback) => {
    setFeedbackList(feedbackList.map((item) => (item.id === updatedFeedback.id ? updatedFeedback : item)))
    setIsEditModalOpen(false)
    toast.success("Feedback updated successfully!")
  }

  const confirmDelete = async () => {
    if (!feedbackToDelete) return

    try {
      const response = await fetch(`http://localhost:8080/api/feedback/${feedbackToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete feedback")
      }

      // Remove the deleted feedback from the list
      setFeedbackList(feedbackList.filter((item) => item.id !== feedbackToDelete.id))
      toast.success("Feedback deleted successfully!")
    } catch (err) {
      console.error("Error deleting feedback:", err)
      toast.error("Failed to delete feedback. Please try again.")
    } finally {
      setIsDeleteModalOpen(false)
      setFeedbackToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Feedback</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Feedback</h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Feedback</h2>

      {feedbackList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No feedback submitted yet.</p>
      ) : (
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {feedbackList.map((feedback) => (
            <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-800">{feedback.subject}</h3>
                <div className="flex">{renderStars(feedback.rating)}</div>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                From: {feedback.name} ({feedback.email})
              </p>

              <p className="text-sm text-gray-500 mt-1">Date: {formatDate(feedback.date)}</p>

              <p className="mt-3 text-gray-700">{feedback.message}</p>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(feedback)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(feedback)}
                  className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentFeedback && (
        <EditFeedbackModal
          feedback={currentFeedback}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          feedbackSubject={feedbackToDelete?.subject}
        />
      )}
    </div>
  )
}

export default FeedbackList
