package com.groupsguru.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private final Map<String, UserRequests> requestCache = new ConcurrentHashMap<>();

    private boolean shouldRateLimit(String path) {
        return path.equals("/api/auth/login")
            || path.equals("/api/auth/register")
            || path.startsWith("/api/admin/questions/bulk")
            || path.startsWith("/api/payments");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (shouldRateLimit(path)) {
            String clientIp = getClientIp(request);
            if (isRateLimited(clientIp)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("Too many requests. Please try again after a minute.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private boolean isRateLimited(String ip) {
        LocalDateTime now = LocalDateTime.now();
        requestCache.entrySet().removeIf(entry -> entry.getValue().lastRequestTime.isBefore(now.minusMinutes(1)));

        UserRequests userRequests = requestCache.computeIfAbsent(ip, k -> new UserRequests(new AtomicInteger(0), now));
        
        if (userRequests.count.get() >= MAX_REQUESTS_PER_MINUTE) {
            return true;
        }

        userRequests.count.incrementAndGet();
        userRequests.lastRequestTime = now;
        return false;
    }

    private static class UserRequests {
        AtomicInteger count;
        LocalDateTime lastRequestTime;

        UserRequests(AtomicInteger count, LocalDateTime lastRequestTime) {
            this.count = count;
            this.lastRequestTime = lastRequestTime;
        }
    }
}
