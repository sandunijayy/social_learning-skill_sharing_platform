package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Feedback;


@Repository
public interface FeedbackRepository extends MongoRepository<Feedback,String>{


}
