package com.example.demo.controller;

import com.example.demo.model.Post;

import com.example.demo.model.SharedPost;
import com.example.demo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;    // ← import this
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.repository.PostRepository;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostService postService;

    /* CREATE */
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam(required = false) String description,
            @RequestParam MultipartFile[] mediaFiles,
            @RequestParam boolean isVideo) {

        try {
            // ← extract userId from the JWT-authenticated principal
            String userId = SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();

            // ← now call your service with the four parameters
            Post post = postService.createPost(userId, description, mediaFiles, isVideo);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed: " + e.getMessage());
        }
    }

    /* READ ALL */
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    /* READ ONE */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable String id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* DELETE */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updateDescription(@PathVariable String id, @RequestBody String description) {
        if (description == null || description.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Post updatedPost = postService.updatePostDescription(id, description.trim());
        return ResponseEntity.ok(updatedPost);
    }
    @GetMapping("/me")
    public ResponseEntity<List<Post>> getMyPosts() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Post> myPosts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(myPosts);
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<SharedPost> sharePost(@PathVariable String id, @RequestBody(required = false) String description) {
        String sharingUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            SharedPost sharedPost = postService.sharePost(id, sharingUserId, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(sharedPost);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/shared")
    public ResponseEntity<List<SharedPost>> getSharedPosts() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<SharedPost> sharedPosts = postService.getSharedPostsByUserId(userId);
        return ResponseEntity.ok(sharedPosts);
    }

}