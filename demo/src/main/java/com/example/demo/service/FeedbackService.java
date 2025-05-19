// package com.example.demo.service;

// import java.util.List;
// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.example.demo.model.Feedback;
// import com.example.demo.repository.FeedbackRepository;


// @Service
// public class FeedbackService {

//     private final FeedbackRepository feedbackRepository;

//     @Autowired
//     public FeedbackService(FeedbackRepository feedbackRepository) {
//         this.feedbackRepository = feedbackRepository;
//     }

//     // Create
//     public Feedback saveFeedback(Feedback feedback) {
//         return feedbackRepository.save(feedback);
//     }

//     // Read all
//     public List<Feedback> getAllFeedback() {
//         return feedbackRepository.findAll();
//     }

//     // Read one
//     public Optional<Feedback> getFeedbackById(String id) {
//         return feedbackRepository.findById(id);
//     }

//     // Update
//     public Feedback updateFeedback(String id, Feedback feedbackDetails) {
//         Feedback feedback = feedbackRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        
//         feedback.setName(feedbackDetails.getName());
//         feedback.setEmail(feedbackDetails.getEmail());
//         feedback.setSubject(feedbackDetails.getSubject());
//         feedback.setRating(feedbackDetails.getRating());
//         feedback.setMessage(feedbackDetails.getMessage());
//         feedback.setDate(feedbackDetails.getDate());
        
//         return feedbackRepository.save(feedback);
//     }

//     // Delete
//     public void deleteFeedback(String id) {
//         Feedback feedback = feedbackRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        
//         feedbackRepository.delete(feedback);
//     }
// }
