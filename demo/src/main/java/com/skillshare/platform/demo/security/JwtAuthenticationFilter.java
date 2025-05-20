package com.skillshare.platform.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // NEW: Added for logging
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class); // NEW: Logger instance
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        logger.debug("Processing request to {} with Authorization header: {}", request.getRequestURI(), authHeader != null ? "Present" : "Missing"); // NEW: Log request details

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No valid Bearer token found for request to {}", request.getRequestURI()); // NEW: Log missing/invalid header
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username;
        try {
            username = jwtService.extractUsername(jwt);
            logger.debug("Extracted username from JWT: {}", username); // NEW: Log extracted username
        } catch (Exception e) {
            logger.error("Failed to extract username from JWT: {}", e.getMessage()); // NEW: Log extraction error
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(jwt, userDetails)) {
                logger.debug("JWT is valid for user: {}. Setting authentication.", username); // NEW: Log valid token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.debug("Authentication set for user: {} with authorities: {}", username, userDetails.getAuthorities()); // NEW: Log authentication setup
            } else {
                logger.warn("Invalid JWT for user: {}", username); // NEW: Log invalid token
            }
        } else {
            logger.warn("No authentication set for username: {} (Authentication already exists or username is null)", username); // NEW: Log authentication skip
        }
        filterChain.doFilter(request, response);
    }
}