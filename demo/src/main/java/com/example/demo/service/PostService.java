package com.example.demo.service;

import com.example.demo.model.Post;

import com.example.demo.model.SharedPost;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface PostService {

    Post createPost(String userId, String description, MultipartFile[] mediaFiles, boolean isVideo) throws IOException;

    List<Post> getAllPosts();

    Optional<Post> getPostById(String id);

    void deletePost(String id);

    Post updatePostDescription(String id, String description);

    List<Post> getPostsByUserId(String userId);

    SharedPost sharePost(String postId, String sharingUserId, String description);
    List<SharedPost> getSharedPostsByUserId(String userId);
}
