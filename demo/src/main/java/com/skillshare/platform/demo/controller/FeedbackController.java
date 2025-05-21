// package com.skillshare.platform.demo.controller;

// import com.skillshare.platform.demo.dto.FeedbackDTO;
// import com.skillshare.platform.demo.dto.request.FeedbackRequest;
// import com.skillshare.platform.demo.dto.response.ApiResponse;
// import com.skillshare.platform.demo.model.User;
// import com.skillshare.platform.demo.security.CurrentUser;
// import com.skillshare.platform.demo.service.FeedbackService;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/feedbacks")
// @RequiredArgsConstructor
// public class FeedbackController {

//     private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);
//     private final FeedbackService feedbackService;

//     @GetMapping
//     public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getAllFeedbacks() {
//         logger.debug("Received request to get all feedbacks");
//         List<FeedbackDTO> feedbacks = feedbackService.getAllFeedbacks();
//         return ResponseEntity.ok(ApiResponse.success("Feedbacks retrieved successfully", feedbacks));
//     }

//     @GetMapping("/user")
//     public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getUserFeedbacks(@CurrentUser User currentUser) {
//         if (currentUser == null) {
//             logger.error("Current user is null for getUserFeedbacks");
//             return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
//         }
//         logger.debug("Received request to get feedbacks for user ID: {}", currentUser.getId());
//         List<FeedbackDTO> feedbacks = feedbackService.getUserFeedbacks(currentUser.getId());
//         return ResponseEntity.ok(ApiResponse.success("User feedbacks retrieved successfully", feedbacks));
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<ApiResponse<FeedbackDTO>> getFeedbackById(@PathVariable Long id) {
//         logger.debug("Received request to get feedback ID: {}", id);
//         FeedbackDTO feedback = feedbackService.getFeedbackById(id);
//         return ResponseEntity.ok(ApiResponse.success("Feedback retrieved successfully", feedback));
//     }

//     @PostMapping
//     public ResponseEntity<ApiResponse<FeedbackDTO>> createFeedback(
//             @Valid @RequestBody FeedbackRequest request,
//             @CurrentUser User currentUser) {
//         if (currentUser == null) {
//             logger.error("Current user is null for createFeedback");
//             return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
//         }
//         logger.debug("Received request to create feedback for user ID: {}", currentUser.getId());
//         FeedbackDTO createdFeedback = feedbackService.createFeedback(request, currentUser.getId());
//         return new ResponseEntity<>(
//                 ApiResponse.success("Feedback created successfully", createdFeedback),
//                 HttpStatus.CREATED);
//     }

//     @PutMapping("/{id}")
//     public ResponseEntity<ApiResponse<FeedbackDTO>> updateFeedback(
//             @PathVariable Long id,
//             @Valid @RequestBody FeedbackRequest request,
//             @CurrentUser User currentUser) {
//         if (currentUser == null) {
//             logger.error("Current user is null for updateFeedback");
//             return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
//         }
//         logger.debug("Received request to update feedback ID: {} for user ID: {}", id, currentUser.getId());
//         FeedbackDTO updatedFeedback = feedbackService.updateFeedback(id, request, currentUser.getId());
//         return ResponseEntity.ok(ApiResponse.success("Feedback updated successfully", updatedFeedback));
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<ApiResponse<Void>> deleteFeedback(
//             @PathVariable Long id,
//             @CurrentUser User currentUser) {
//         if (currentUser == null) {
//             logger.error("Current user is null for deleteFeedback");
//             return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
//         }
//         logger.debug("Received request to delete feedback ID: {} for user ID: {}", id, currentUser.getId());
//         feedbackService.deleteFeedback(id, currentUser.getId());
//         return ResponseEntity.ok(ApiResponse.success("Feedback deleted successfully", null));
//     }
// }


package com.skillshare.platform.demo.controller;

import com.skillshare.platform.demo.dto.FeedbackDTO;
import com.skillshare.platform.demo.dto.request.FeedbackRequest;
import com.skillshare.platform.demo.dto.response.ApiResponse;
import com.skillshare.platform.demo.security.CurrentUser;
import com.skillshare.platform.demo.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);
    private final FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getAllFeedbacks() {
        logger.debug("Received request to get all feedbacks");
        List<FeedbackDTO> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(ApiResponse.success("Feedbacks retrieved successfully", feedbacks));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getUserFeedbacks(@CurrentUser Long currentUserId) {
        if (currentUserId == null) {
            logger.error("Current user ID is null for getUserFeedbacks");
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to get feedbacks for user ID: {}", currentUserId);
        List<FeedbackDTO> feedbacks = feedbackService.getUserFeedbacks(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("User feedbacks retrieved successfully", feedbacks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackDTO>> getFeedbackById(@PathVariable Long id) {
        logger.debug("Received request to get feedback ID: {}", id);
        FeedbackDTO feedback = feedbackService.getFeedbackById(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback retrieved successfully", feedback));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackDTO>> createFeedback(
            @Valid @RequestBody FeedbackRequest request,
            @CurrentUser Long currentUserId) {
        if (currentUserId == null) {
            logger.error("Current user ID is null for createFeedback");
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to create feedback for user ID: {}", currentUserId);
        FeedbackDTO createdFeedback = feedbackService.createFeedback(request, currentUserId);
        return new ResponseEntity<>(
                ApiResponse.success("Feedback created successfully", createdFeedback),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackDTO>> updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackRequest request,
            @CurrentUser Long currentUserId) {
        if (currentUserId == null) {
            logger.error("Current user ID is null for updateFeedback");
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to update feedback ID: {} for user ID: {}", id, currentUserId);
        FeedbackDTO updatedFeedback = feedbackService.updateFeedback(id, request, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Feedback updated successfully", updatedFeedback));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(
            @PathVariable Long id,
            @CurrentUser Long currentUserId) {
        if (currentUserId == null) {
            logger.error("Current user ID is null for deleteFeedback");
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        logger.debug("Received request to delete feedback ID: {} for user ID: {}", id, currentUserId);
        feedbackService.deleteFeedback(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted successfully", null));
    }
}