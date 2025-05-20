package com.skillshare.platform.demo.controller;

import com.skillshare.platform.demo.dto.FeedbackDTO;
import com.skillshare.platform.demo.dto.request.FeedbackRequest;
import com.skillshare.platform.demo.dto.response.ApiResponse;
import com.skillshare.platform.demo.model.User;
import com.skillshare.platform.demo.security.CurrentUser;
import com.skillshare.platform.demo.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger; // NEW: Added for logging
import org.slf4j.LoggerFactory; // NEW: Added for logging
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class); // NEW: Logger instance
    private final FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getAllFeedbacks() {
        logger.debug("Received request to get all feedbacks"); // NEW: Log request
        List<FeedbackDTO> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(ApiResponse.success("Feedbacks retrieved successfully", feedbacks));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getUserFeedbacks(@CurrentUser User currentUser) {
        // CHANGED: Added null check
        if (currentUser == null) {
            logger.error("Current user is null for getUserFeedbacks"); // NEW: Log error
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to get feedbacks for user ID: {}", currentUser.getId()); // NEW: Log request
        List<FeedbackDTO> feedbacks = feedbackService.getUserFeedbacks(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User feedbacks retrieved successfully", feedbacks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackDTO>> getFeedbackById(@PathVariable Long id) {
        logger.debug("Received request to get feedback ID: {}", id); // NEW: Log request
        FeedbackDTO feedback = feedbackService.getFeedbackById(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback retrieved successfully", feedback));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackDTO>> createFeedback(
            @Valid @RequestBody FeedbackRequest request,
            @CurrentUser User currentUser) {
        // CHANGED: Added null check
        if (currentUser == null) {
            logger.error("Current user is null for createFeedback"); // NEW: Log error
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to create feedback for user ID: {}", currentUser.getId()); // NEW: Log request
        FeedbackDTO createdFeedback = feedbackService.createFeedback(request, currentUser.getId());
        return new ResponseEntity<>(
                ApiResponse.success("Feedback created successfully", createdFeedback),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackDTO>> updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest request,
            @CurrentUser User currentUser) {
        // CHANGED: Added null check
        if (currentUser == null) {
            logger.error("Current user is null for updateFeedback"); // NEW: Log error
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to update feedback ID: {} for user ID: {}", id, currentUser.getId()); // NEW: Log request
        FeedbackDTO updatedFeedback = feedbackService.updateFeedback(id, request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Feedback updated successfully", updatedFeedback));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(
            @PathVariable Long id,
            @CurrentUser User currentUser) {
        // CHANGED: Added null check
        if (currentUser == null) {
            logger.error("Current user is null for deleteFeedback"); // NEW: Log error
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to delete feedback ID: {} for user ID: {}", id, currentUser.getId()); // NEW: Log request
        feedbackService.deleteFeedback(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted successfully", null));
    }
}