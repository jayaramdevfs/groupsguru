package com.lms.auth;

import com.lms.auth.dto.AuthMeResponse;
import com.lms.auth.dto.LoginRequest;
import com.lms.auth.dto.RegisterRequest;
import com.lms.common.ApiResponse;
import com.lms.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String ACCESS_TOKEN_COOKIE = "access_token";

    private final AuthService authService;
    private final JwtService jwtService;

    @Value("${app.auth.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${app.auth.cookie.same-site:Lax}")
    private String cookieSameSite;

    @Value("${app.auth.cookie.domain:}")
    private String cookieDomain;

    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest request) {

        String message = authService.register(request);

        return ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .data(null)
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<String> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {

        String token = authService.login(request.getEmail(), request.getPassword());
        response.addHeader(HttpHeaders.SET_COOKIE, buildAccessTokenCookie(token).toString());

        // Return token in body for mobile clients (React Native can't use HttpOnly cookies)
        return ApiResponse.<String>builder()
                .success(true)
                .message("Login successful")
                .data(token)
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<AuthMeResponse> me(Authentication authentication) {

        AuthMeResponse me = authService.getMe(authentication.getName());

        return ApiResponse.<AuthMeResponse>builder()
                .success(true)
                .message("User fetched successfully")
                .data(me)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {

        response.addHeader(HttpHeaders.SET_COOKIE, buildClearAccessTokenCookie().toString());

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Logout successful")
                .data(null)
                .build();
    }

    private ResponseCookie buildAccessTokenCookie(String token) {

        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(Duration.ofMillis(jwtService.getExpirationMs()));

        if (cookieDomain != null && !cookieDomain.isBlank()) {
            builder.domain(cookieDomain);
        }

        return builder.build();
    }

    private ResponseCookie buildClearAccessTokenCookie() {

        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(Duration.ZERO);

        if (cookieDomain != null && !cookieDomain.isBlank()) {
            builder.domain(cookieDomain);
        }

        return builder.build();
    }
}
