// package com.skillshare.platform.demo.service;

// import com.skillshare.platform.demo.dto.FeedbackDTO;
// import com.skillshare.platform.demo.dto.UserDTO;
// import com.skillshare.platform.demo.dto.request.FeedbackRequest;
// import com.skillshare.platform.demo.exception.ResourceNotFoundException;
// import com.skillshare.platform.demo.model.Feedback;
// import com.skillshare.platform.demo.model.User;
// import com.skillshare.platform.demo.repository.FeedbackRepository;
// import com.skillshare.platform.demo.repository.UserRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// public class FeedbackService {

//     private final FeedbackRepository feedbackRepository;
//     private final UserRepository userRepository;

//     public List<FeedbackDTO> getAllFeedbacks() {
//         return feedbackRepository.findAllByOrderByCreatedAtDesc()
//                 .stream()
//                 .map(this::mapToDTO)
//                 .collect(Collectors.toList());
//     }

//     public List<FeedbackDTO> getUserFeedbacks(Long userId) {
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
//         return feedbackRepository.findByUserOrderByCreatedAtDesc(user)
//                 .stream()
//                 .map(this::mapToDTO)
//                 .collect(Collectors.toList());
//     }

//     public FeedbackDTO getFeedbackById(Long id) {
//         Feedback feedback = feedbackRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        
//         return mapToDTO(feedback);
//     }

//     public FeedbackDTO createFeedback(FeedbackRequest request, Long userId) {
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
//         Feedback feedback = Feedback.builder()
//                 .title(request.getTitle())
//                 .content(request.getContent())
//                 .rating(request.getRating())
//                 .user(user)
//                 .createdAt(LocalDateTime.now())
//                 .updatedAt(LocalDateTime.now())
//                 .build();
        
//         Feedback savedFeedback = feedbackRepository.save(feedback);
//         return mapToDTO(savedFeedback);
//     }

//     public FeedbackDTO updateFeedback(Long id, FeedbackRequest request, Long userId) {
//         Feedback feedback = feedbackRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        
//         // Check if the feedback belongs to the user
//         if (!feedback.getUser().getId().equals(userId)) {
//             throw new IllegalArgumentException("You can only update your own feedback");
//         }
        
//         feedback.setTitle(request.getTitle());
//         feedback.setContent(request.getContent());
//         feedback.setRating(request.getRating());
//         feedback.setUpdatedAt(LocalDateTime.now());
        
//         Feedback updatedFeedback = feedbackRepository.save(feedback);
//         return mapToDTO(updatedFeedback);
//     }

//     public void deleteFeedback(Long id, Long userId) {
//         Feedback feedback = feedbackRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        
//         // Check if the feedback belongs to the user
//         if (!feedback.getUser().getId().equals(userId)) {
//             throw new IllegalArgumentException("You can only delete your own feedback");
//         }
        
//         feedbackRepository.delete(feedback);
//     }

//     private FeedbackDTO mapToDTO(Feedback feedback) {
//         UserDTO userDTO = UserDTO.builder()
//                 .id(feedback.getUser().getId())
//                 .username(feedback.getUser().getUsername())
//                 .name(feedback.getUser().getName())
//                 .avatarUrl(feedback.getUser().getAvatarUrl())
//                 .build();
        
//         return FeedbackDTO.builder()
//                 .id(feedback.getId())
//                 .title(feedback.getTitle())
//                 .content(feedback.getContent())
//                 .rating(feedback.getRating())
//                 .user(userDTO)
//                 .createdAt(feedback.getCreatedAt())
//                 .updatedAt(feedback.getUpdatedAt())
//                 .build();
//     }
// }


package com.skillshare.platform.demo.service;

import com.skillshare.platform.demo.dto.FeedbackDTO;
import com.skillshare.platform.demo.dto.UserDTO;
import com.skillshare.platform.demo.dto.request.FeedbackRequest;
import com.skillshare.platform.demo.exception.ResourceNotFoundException;
import com.skillshare.platform.demo.model.Feedback;
import com.skillshare.platform.demo.model.User;
import com.skillshare.platform.demo.repository.FeedbackRepository;
import com.skillshare.platform.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getUserFeedbacks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return feedbackRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FeedbackDTO getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        return mapToDTO(feedback);
    }

    @Transactional
    public FeedbackDTO createFeedback(FeedbackRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Feedback feedback = Feedback.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .rating(request.getRating())
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return mapToDTO(savedFeedback);
    }

    @Transactional
    public FeedbackDTO updateFeedback(Long id, FeedbackRequest request, Long userId) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        if (!feedback.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own feedback");
        }
        feedback.setTitle(request.getTitle());
        feedback.setContent(request.getContent());
        feedback.setRating(request.getRating());
        feedback.setUpdatedAt(LocalDateTime.now());
        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return mapToDTO(updatedFeedback);
    }

    @Transactional
    public void deleteFeedback(Long id, Long userId) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        if (!feedback.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own feedback");
        }
        feedbackRepository.delete(feedback);
    }

    private FeedbackDTO mapToDTO(Feedback feedback) {
        UserDTO userDTO = UserDTO.builder()
                .id(feedback.getUser().getId())
                .username(feedback.getUser().getUsername())
                .name(feedback.getUser().getName())
                .avatarUrl(feedback.getUser().getAvatarUrl())
                .build();
        return FeedbackDTO.builder()
                .id(feedback.getId())
                .title(feedback.getTitle())
                .content(feedback.getContent())
                .rating(feedback.getRating())
                .user(userDTO)
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}