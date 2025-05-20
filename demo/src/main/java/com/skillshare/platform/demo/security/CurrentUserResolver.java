// package com.skillshare.platform.demo.security;

// import com.skillshare.platform.demo.model.User;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.core.MethodParameter;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.Authentication;
// import org.springframework.stereotype.Component;
// import org.springframework.web.bind.support.WebDataBinderFactory;
// import org.springframework.web.context.request.NativeWebRequest;
// import org.springframework.web.method.support.HandlerMethodArgumentResolver;
// import org.springframework.web.method.support.ModelAndViewContainer;

// @Component
// public class CurrentUserResolver implements HandlerMethodArgumentResolver {

//     private static final Logger logger = LoggerFactory.getLogger(CurrentUserResolver.class);

//     @Override
//     public boolean supportsParameter(MethodParameter parameter) {
//         return parameter.getParameterAnnotation(CurrentUser.class) != null
//                 && parameter.getParameterType().equals(User.class);
//     }

//     @Override
//     public Object resolveArgument(
//             MethodParameter parameter,
//             ModelAndViewContainer mavContainer,
//             NativeWebRequest webRequest,
//             WebDataBinderFactory binderFactory) {
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//         if (authentication == null || !authentication.isAuthenticated()) {
//             logger.warn("No authenticated user found in SecurityContextHolder");
//             return null;
//         }
//         Object principal = authentication.getPrincipal();
//         if (principal instanceof User user) {
//             logger.debug("Resolved CurrentUser: {}", user.getUsername());
//             return user;
//         }
//         logger.warn("Principal is not a User instance: {}", principal != null ? principal.getClass().getName() : "null");
//         return null;
//     }
// }