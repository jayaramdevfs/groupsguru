package com.groupsguru.config;

import com.groupsguru.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final com.groupsguru.security.RateLimitFilter rateLimitFilter;
    private final org.springframework.core.env.Environment environment;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        boolean isProduction = java.util.Arrays.asList(environment.getActiveProfiles()).contains("prod");

        http
                .cors(cors -> {}) // use CorsConfig bean
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // For H2 console
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                        if (!isProduction) {
                            auth.requestMatchers("/h2-console/**").permitAll();
                        }
                        auth.requestMatchers("/api/health").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/access/**", "/api/commissions/**", "/api/categories/**", "/api/subcategories/**", "/api/sections/**", "/api/topics/**", "/api/registry/**", "/api/questions/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/content/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/exams", "/api/exams/*").permitAll()
                        .requestMatchers("/api/exams/**").authenticated()
                        .requestMatchers("/api/admin/test-series/**").hasRole("ADMIN")
                        .requestMatchers("/api/student/test-series/**").hasRole("STUDENT")
                        .requestMatchers("/api/admin/content/**").hasRole("ADMIN")
                        .requestMatchers("/api/student/content/**").hasRole("STUDENT")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/student/**").hasRole("STUDENT")
                        .anyRequest().authenticated();
                });

        http.addFilterBefore(
                rateLimitFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
