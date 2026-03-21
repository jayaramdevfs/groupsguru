package com.lms.exam;

import com.lms.auth.User;
import com.lms.auth.UserRepository;
import com.lms.exam.dto.AttemptStartResponse;
import com.lms.exam.dto.SubmitAttemptRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamAttemptController {
    private final ExamAttemptService attemptService;
    private final UserRepository userRepository;

    @PostMapping("/{examId}/start")
    public ResponseEntity<AttemptStartResponse> startAttempt(
            @PathVariable Long examId,
            Authentication authentication) {
        User user = resolveUser(authentication);
        return ResponseEntity.ok(attemptService.startAttempt(examId, user.getId()));
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<ExamAttempt> submitAttempt(
            @PathVariable Long attemptId,
            Authentication authentication,
            @RequestBody SubmitAttemptRequest request) {
        User user = resolveUser(authentication);
        return ResponseEntity.ok(attemptService.submitAttempt(attemptId, user.getId(), request));
    }

    @GetMapping("/my-attempts")
    public ResponseEntity<List<ExamAttempt>> getMyAttempts(Authentication authentication) {
        User user = resolveUser(authentication);
        return ResponseEntity.ok(attemptService.getMyAttempts(user.getId()));
    }

    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<ExamAttempt> getAttempt(
            @PathVariable Long attemptId,
            Authentication authentication) {
        User user = resolveUser(authentication);
        return ResponseEntity.ok(attemptService.getAttempt(attemptId, user.getId()));
    }

    private User resolveUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
