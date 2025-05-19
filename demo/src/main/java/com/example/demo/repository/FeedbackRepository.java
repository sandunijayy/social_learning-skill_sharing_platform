package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Feedback;


@Repository
public interface FeedbackRepository extends MongoRepository<Feedback,String>{

    // Custom query methods can be defined here if needed
    // For example, to find feedback by userId:
    // List<Feedback> findByUserId(String userId);
}
