package com.groupsguru.exam;

import com.groupsguru.auth.User;
import com.groupsguru.auth.UserRepository;
import com.groupsguru.exam.dto.AttemptStartResponse;
import com.groupsguru.exam.dto.ExamResultDTO;
import com.groupsguru.exam.dto.PracticeAnswerRequest;
import com.groupsguru.exam.dto.PracticeAnswerResponse;
import com.groupsguru.exam.dto.SubmitAttemptRequest;
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

    @PostMapping("/{examId}/practice-answer")
    public ResponseEntity<PracticeAnswerResponse> submitPracticeAnswer(
            @PathVariable Long examId,
            @RequestBody PracticeAnswerRequest request) {
        return ResponseEntity.ok(attemptService.submitPracticeAnswer(examId, request));
    }

    @GetMapping("/my-attempts")
    public ResponseEntity<List<ExamAttempt>> getMyAttempts(Authentication authentication) {
        User user = resolveUser(authentication);
        return ResponseEntity.ok(attemptService.getMyAttempts(user.getId()));
    }

    @GetMapping("/attempts/{attemptId}/result")
    public ResponseEntity<ExamResultDTO> getAttemptResult(
            @PathVariable Long attemptId,
            Authentication authentication) {
        User user = resolveUser(authentication);
        return ResponseEntity.ok(attemptService.getAttemptResult(attemptId, user.getId()));
    }

    private User resolveUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
