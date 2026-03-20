package com.lms.exam;

import com.lms.auth.User;
import com.lms.exam.dto.AttemptStartResponse;
import com.lms.exam.dto.SubmitAttemptRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamAttemptController {
    private final ExamAttemptService attemptService;

    @PostMapping("/{examId}/start")
    public ResponseEntity<AttemptStartResponse> startAttempt(
            @PathVariable Long examId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(attemptService.startAttempt(examId, user.getId()));
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<ExamAttempt> submitAttempt(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal User user,
            @RequestBody SubmitAttemptRequest request) {
        return ResponseEntity.ok(attemptService.submitAttempt(attemptId, user.getId(), request));
    }

    @GetMapping("/my-attempts")
    public ResponseEntity<List<ExamAttempt>> getMyAttempts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(attemptService.getMyAttempts(user.getId()));
    }

    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<ExamAttempt> getAttempt(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(attemptService.getAttempt(attemptId, user.getId()));
    }
}
