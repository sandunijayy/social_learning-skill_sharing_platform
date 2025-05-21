package com.skillshare.platform.demo.repository;

import com.skillshare.platform.demo.model.Feedback;
import com.skillshare.platform.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUser(User user);
    List<Feedback> findByUserOrderByCreatedAtDesc(User user);
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
