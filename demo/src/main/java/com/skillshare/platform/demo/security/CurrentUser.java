package com.skillshare.platform.demo.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.*;

@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal(expression = "id")
public @interface CurrentUser {
}

// package com.skillshare.platform.demo.security;

// import java.lang.annotation.ElementType;
// import java.lang.annotation.Retention;
// import java.lang.annotation.RetentionPolicy;
// import java.lang.annotation.Target;

// @Target({ElementType.PARAMETER, ElementType.TYPE})
// @Retention(RetentionPolicy.RUNTIME)
// public @interface CurrentUser {
// }