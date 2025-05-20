// import axios from "axios";
// import env from "../config/env";

// // Create axios instance with default config
// export const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add debug interceptors
// if (env.DEBUG) {
//   api.interceptors.request.use((request) => {
//     console.log("Starting Request", request);
//     return request;
//   });

//   api.interceptors.response.use(
//     (response) => {
//       console.log("Response:", response);
//       return response;
//     },
//     (error) => {
//       console.log("Response Error:", error.response?.data || error.message);
//       return Promise.reject(error);
//     },
//   );
// }

// // Add request interceptor to set auth token
// api.interceptors.request.use(
//   (config) => {
//     console.log("Making API request with config:", config); // CHANGED: Added detailed logging
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Add response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => {
//     if (process.env.NODE_ENV === "development") {
//       console.log(`Response from ${response.config.url}:`, response.data);
//     }
//     return response;
//   },
//   (error) => {
//     if (process.env.NODE_ENV === "development") {
//       console.error(`Error from ${error.config?.url}:`, error.response?.data || error.message);
//     }
//     // CHANGED: Only redirect on 401, not 403, to allow FeedbacksPage to handle 403 errors
//     if (error.response && error.response.status === 401) {
//       if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
//         console.log("401 error detected, clearing token and redirecting to /login");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// // Auth API
// export const authAPI = {
//   login: (credentials) => api.post("/api/auth/login", credentials),
//   register: (userData) => api.post("/api/auth/register", userData),
// };

// // User API
// export const userAPI = {
//   getUserByUsername: (username) => api.get(`/api/users/${username}`),
//   updateUser: (id, userData) => {
//     const isFormData = userData instanceof FormData;
//     const headers = isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };
//     console.log(`Updating user ${id} with ${isFormData ? "FormData" : "JSON"}`);
//     return api.put(`/api/users/${id}`, userData, { headers });
//   },
//   searchUsers: (query) => api.get(`/api/users/search?query=${query}`),
//   getSuggestedUsers: (limit = 5) => api.get(`/api/users/suggested?limit=${limit}`),
//   followUser: (id) => api.post(`/api/users/${id}/follow`),
//   unfollowUser: (id) => api.post(`/api/users/${id}/unfollow`),
//   getFollowers: (id) => api.get(`/api/users/${id}/followers`),
//   getFollowing: (id) => api.get(`/api/users/${id}/following`),
// };

// // Post API
// export const postAPI = {
//   getAllPosts: (page = 0, size = 10) => api.get(`/api/posts?page=${page}&size=${size}`),
//   getPostById: (id) => api.get(`/api/posts/${id}`),
//   getPostsByUserId: (userId, page = 0, size = 10) => api.get(`/api/posts/user/${userId}?page=${page}&size=${size}`),
//   getFeedPosts: (page = 0, size = 10) => api.get(`/api/posts/feed?page=${page}&size=${size}`),
//   searchPosts: (query, page = 0, size = 10) => api.get(`/api/posts/search?query=${query}&page=${page}&size=${size}`),
//   createPost: (postData, files) => {
//     const formData = new FormData();
//     formData.append("post", new Blob([JSON.stringify(postData)], { type: "application/json" }));
//     if (files && files.length > 0) {
//       files.forEach((file, index) => {
//         if (file) {
//           console.log(`Appending file ${index}:`, file.name, file.type, file.size);
//           formData.append("files", file);
//         }
//       });
//     }
//     console.log("Creating post with data:", postData);
//     console.log("Files count:", files ? files.length : 0);
//     for (const pair of formData.entries()) {
//       console.log(pair[0], pair[1] instanceof Blob ? "Blob:" + pair[1].size : pair[1]);
//     }
//     return api.post("/api/posts/create", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },
//   updatePost: (id, postData) => api.put(`/api/posts/${id}`, postData),
//   deletePost: (id) => api.delete(`/api/posts/${id}`),
// };

// // Comment API
// export const commentAPI = {
//   getCommentsByPostId: (postId) => api.get(`/api/posts/${postId}/comments`),
//   createComment: async (postId, commentData) => {
//     console.log(`Creating comment for post ${postId} with data:`, commentData);
//     try {
//       const response = await api.post(`/api/posts/${postId}/comments`, commentData);
//       console.log("Comment creation response:", response);
//       return response;
//     } catch (error) {
//       console.error(`Error creating comment for post ${postId}:`, error);
//       console.error("Error response:", error.response?.data);
//       throw error;
//     }
//   },
//   updateComment: (postId, commentId, commentData) => api.put(`/api/posts/${postId}/comments/${commentId}`, commentData),
//   deleteComment: (postId, commentId) => api.delete(`/api/posts/${postId}/comments/${commentId}`),
// };

// // Like API
// export const likeAPI = {
//   likePost: (postId) => api.post(`/api/posts/${postId}/likes`),
//   unlikePost: (postId) => api.delete(`/api/posts/${postId}/likes`),
//   getLikesCount: (postId) => api.get(`/api/posts/${postId}/likes/count`),
//   isPostLikedByUser: (postId) => api.get(`/api/posts/${postId}/likes/status`),
// };

// // Learning Plan API
// export const learningPlanAPI = {
//   getAllLearningPlans: (page = 0, size = 10) => {
//     console.log(`Fetching all learning plans with page=${page}, size=${size}`);
//     return api.get(`/api/learning-plans?page=${page}&size=${size}`);
//   },
//   getLearningPlansByUserId: (userId) => {
//     console.log(`Fetching learning plans for user ${userId}`);
//     return api.get(`/api/learning-plans/user/${userId}`);
//   },
//   getLearningPlanById: (id) => {
//     console.log(`Fetching learning plan with id ${id}`);
//     return api.get(`/api/learning-plans/${id}`);
//   },
//   searchLearningPlans: (query, page = 0, size = 10) => {
//     console.log(`Searching learning plans with query=${query}, page=${page}, size=${size}`);
//     return api.get(`/api/learning-plans/search?query=${query}&page=${page}&size=${size}`);
//   },
//   createLearningPlan: (planData) => {
//     console.log(`Creating learning plan with data:`, planData);
//     return api.post("/api/learning-plans", planData);
//   },
//   updateLearningPlan: (id, planData) => {
//     console.log(`Updating learning plan ${id} with data:`, planData);
//     return api.put(`/api/learning-plans/${id}`, planData);
//   },
//   deleteLearningPlan: (id) => {
//     console.log(`Deleting learning plan ${id}`);
//     return api.delete(`/api/learning-plans/${id}`);
//   },
//   updateTopicCompletion: (planId, topicId, completed) => {
//     console.log(`Updating topic ${topicId} completion status to ${completed}`);
//     return api.put(`/api/learning-plans/${planId}/topics/${topicId}`, { completed });
//   },
// };

// // Story API
// export const storyAPI = {
//   getAllStories: (page = 0, size = 10) => api.get(`/api/stories?page=${page}&size=${size}`),
//   getUserStories: (userId) => api.get(`/api/stories/user/${userId}`),
//   getFeedStories: () => api.get("/api/stories/feed"),
//   createStory: (storyData, mediaFile) => {
//     const formData = new FormData();
//     if (storyData.title) {
//       formData.append("title", storyData.title);
//     }
//     if (storyData.content) {
//       formData.append("content", storyData.content);
//     }
//     if (mediaFile) {
//       console.log("Appending story media file:", mediaFile.name, mediaFile.type, mediaFile.size);
//       formData.append("media", mediaFile);
//     }
//     console.log("Creating story with data:", storyData);
//     for (const pair of formData.entries()) {
//       console.log(pair[0], pair[1] instanceof Blob ? `Blob: ${pair[1].size} bytes` : pair[1]);
//     }
//     return api.post("/api/stories/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   },
//   viewStory: (id) => api.post(`/api/stories/${id}/view`),
//   deleteStory: (id) => api.delete(`/api/stories/${id}`),
// };

// // Notification API
// export const notificationAPI = {
//   getUserNotifications: (page = 0, size = 10) => api.get(`/api/notifications?page=${page}&size=${size}`),
//   readNotification: (id) => api.put(`/api/notifications/${id}/read`),
//   deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
//   getUnreadNotificationsCount: () => api.get(`/api/notifications/unread/count`), // NEW: Added to fix Header.js error
// };

// // Feedback API
// export const feedbackAPI = {
//   getAllFeedbacks: () => api.get("/api/feedbacks"),
//   getUserFeedbacks: () => api.get("/api/feedbacks/user"),
//   getFeedbackById: (id) => api.get(`/api/feedbacks/${id}`),
//   createFeedback: (feedbackData) => {
//     console.log("Creating feedback with data:", feedbackData);
//     return api.post("/api/feedbacks", feedbackData);
//   },
//   updateFeedback: (id, feedbackData) => {
//     console.log(`Updating feedback ${id} with data:`, feedbackData);
//     return api.put(`/api/feedbacks/${id}`, feedbackData);
//   },
//   deleteFeedback: (id) => {
//     console.log(`Deleting feedback ${id}`);
//     return api.delete(`/api/feedbacks/${id}`);
//   },
// };


import axios from "axios";
import env from "../config/env";

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add debug interceptors
if (env.DEBUG) {
  api.interceptors.request.use((request) => {
    console.log("Starting Request", request);
    return request;
  });

  api.interceptors.response.use(
    (response) => {
      console.log("Response:", response);
      return response;
    },
    (error) => {
      console.log("Response Error:", error.response?.data || error.message);
      return Promise.reject(error);
    },
  );
}

// Add request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    console.log("Making API request with config:", config);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Response from ${response.config.url}:`, response.data);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error from ${error.config?.url}:`, {
        status: error.response?.status,
        data: error.response?.data || error.message,
      });
    }
    // CHANGED: Skip redirect for all /api/feedbacks/* endpoints
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config?.url.startsWith("/api/feedbacks/")
    ) {
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        console.log("401 error detected, clearing token and redirecting to /login");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
};

// User API
export const userAPI = {
  getUserByUsername: (username) => api.get(`/api/users/${username}`),
  updateUser: (id, userData) => {
    const isFormData = userData instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };
    console.log(`Updating user ${id} with ${isFormData ? "FormData" : "JSON"}`);
    return api.put(`/api/users/${id}`, userData, { headers });
  },
  searchUsers: (query) => api.get(`/api/users/search?query=${query}`),
  getSuggestedUsers: (limit = 5) => api.get(`/api/users/suggested?limit=${limit}`),
  followUser: (id) => api.post(`/api/users/${id}/follow`),
  unfollowUser: (id) => api.post(`/api/users/${id}/unfollow`),
  getFollowers: (id) => api.get(`/api/users/${id}/followers`),
  getFollowing: (id) => api.get(`/api/users/${id}/following`),
};

// Post API
export const postAPI = {
  getAllPosts: (page = 0, size = 10) => api.get(`/api/posts?page=${page}&size=${size}`),
  getPostById: (id) => api.get(`/api/posts/${id}`),
  getPostsByUserId: (userId, page = 0, size = 10) => api.get(`/api/posts/user/${userId}?page=${page}&size=${size}`),
  getFeedPosts: (page = 0, size = 10) => api.get(`/api/posts/feed?page=${page}&size=${size}`),
  searchPosts: (query, page = 0, size = 10) => api.get(`/api/posts/search?query=${query}&page=${page}&size=${size}`),
  createPost: (postData, files) => {
    const formData = new FormData();
    formData.append("post", new Blob([JSON.stringify(postData)], { type: "application/json" }));
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        if (file) {
          console.log(`Appending file ${index}:`, file.name, file.type, file.size);
          formData.append("files", file);
        }
      });
    }
    console.log("Creating post with data:", postData);
    console.log("Files count:", files ? files.length : 0);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1] instanceof Blob ? "Blob:" + pair[1].size : pair[1]);
    }
    return api.post("/api/posts/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updatePost: (id, postData) => api.put(`/api/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
};

// Comment API
export const commentAPI = {
  getCommentsByPostId: (postId) => api.get(`/api/posts/${postId}/comments`),
  createComment: async (postId, commentData) => {
    console.log(`Creating comment for post ${postId} with data:`, commentData);
    try {
      const response = await api.post(`/api/posts/${postId}/comments`, commentData);
      console.log("Comment creation response:", response);
      return response;
    } catch (error) {
      console.error(`Error creating comment for post ${postId}:`, error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },
  updateComment: (postId, commentId, commentData) => api.put(`/api/posts/${postId}/comments/${commentId}`, commentData),
  deleteComment: (postId, commentId) => api.delete(`/api/posts/${postId}/comments/${commentId}`),
};

// Like API
export const likeAPI = {
  likePost: (postId) => api.post(`/api/posts/${postId}/likes`),
  unlikePost: (postId) => api.delete(`/api/posts/${postId}/likes`),
  getLikesCount: (postId) => api.get(`/api/posts/${postId}/likes/count`),
  isPostLikedByUser: (postId) => api.get(`/api/posts/${postId}/likes/status`),
};

// Learning Plan API
export const learningPlanAPI = {
  getAllLearningPlans: (page = 0, size = 10) => {
    console.log(`Fetching all learning plans with page=${page}, size=${size}`);
    return api.get(`/api/learning-plans?page=${page}&size=${size}`);
  },
  getLearningPlansByUserId: (userId) => {
    console.log(`Fetching learning plans for user ${userId}`);
    return api.get(`/api/learning-plans/user/${userId}`);
  },
  getLearningPlanById: (id) => {
    console.log(`Fetching learning plan with id ${id}`);
    return api.get(`/api/learning-plans/${id}`);
  },
  searchLearningPlans: (query, page = 0, size = 10) => {
    console.log(`Searching learning plans with query=${query}, page=${page}, size=${size}`);
    return api.get(`/api/learning-plans/search?query=${query}&page=${page}&size=${size}`);
  },
  createLearningPlan: (planData) => {
    console.log(`Creating learning plan with data:`, planData);
    return api.post("/api/learning-plans", planData);
  },
  updateLearningPlan: (id, planData) => {
    console.log(`Updating learning plan ${id} with data:`, planData);
    return api.put(`/api/learning-plans/${id}`, planData);
  },
  deleteLearningPlan: (id) => {
    console.log(`Deleting learning plan ${id}`);
    return api.delete(`/api/learning-plans/${id}`);
  },
  updateTopicCompletion: (planId, topicId, completed) => {
    console.log(`Updating topic ${topicId} completion status to ${completed}`);
    return api.put(`/api/learning-plans/${planId}/topics/${topicId}`, { completed });
  },
};

// Story API
export const storyAPI = {
  getAllStories: (page = 0, size = 10) => api.get(`/api/stories?page=${page}&size=${size}`),
  getUserStories: (userId) => api.get(`/api/stories/user/${userId}`),
  getFeedStories: () => api.get("/api/stories/feed"),
  createStory: (storyData, mediaFile) => {
    const formData = new FormData();
    if (storyData.title) {
      formData.append("title", storyData.title);
    }
    if (storyData.content) {
      formData.append("content", storyData.content);
    }
    if (mediaFile) {
      console.log("Appending story media file:", mediaFile.name, mediaFile.type, mediaFile.size);
      formData.append("media", mediaFile);
    }
    console.log("Creating story with data:", storyData);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1] instanceof Blob ? `Blob: ${pair[1].size} bytes` : pair[1]);
    }
    return api.post("/api/stories/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  viewStory: (id) => api.post(`/api/stories/${id}/view`),
  deleteStory: (id) => api.delete(`/api/stories/${id}`),
};

// Notification API
export const notificationAPI = {
  getUserNotifications: (page = 0, size = 10) => api.get(`/api/notifications?page=${page}&size=${size}`),
  readNotification: (id) => api.put(`/api/notifications/${id}/read`),
  deleteNotification: (id) => api.delete(`/api/notifications/${id}`),
  getUnreadNotificationsCount: () => api.get(`/api/notifications/unread/count`),
};

// Feedback API
export const feedbackAPI = {
  getAllFeedbacks: () => api.get("/api/feedbacks"),
  getUserFeedbacks: () => api.get("/api/feedbacks/user"),
  getFeedbackById: (id) => api.get(`/api/feedbacks/${id}`),
  createFeedback: (feedbackData) => {
    console.log("Creating feedback with data:", feedbackData);
    return api.post("/api/feedbacks", feedbackData);
  },
  updateFeedback: (id, feedbackData) => {
    console.log(`Updating feedback ${id} with data:`, feedbackData);
    return api.put(`/api/feedbacks/${id}`, feedbackData);
  },
  deleteFeedback: (id) => {
    console.log(`Deleting feedback ${id}`);
    return api.delete(`/api/feedbacks/${id}`);
  },
};