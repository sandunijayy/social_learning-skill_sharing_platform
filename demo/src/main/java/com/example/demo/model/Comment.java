package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "comments")
@Data
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String content;
    private Date createdAt = new Date();
}
