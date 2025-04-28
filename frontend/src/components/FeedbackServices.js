import axios from 'axios';

const API_URL = 'http://localhost:8080/api/feedback'; // Your backend URL

// Get all feedback
export const getFeedback = () => axios.get(API_URL);

// Create feedback
export const createFeedback = (feedbackData) => axios.post(API_URL, feedbackData);

// Update feedback
export const updateFeedback = (id, feedbackData) => axios.put(`${API_URL}/${id}`, feedbackData);

// Delete feedback
export const deleteFeedback = (id) => axios.delete(`${API_URL}/${id}`);