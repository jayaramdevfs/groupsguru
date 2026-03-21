package com.lms.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.lms.registry.MicroTopicRepository;
import com.lms.question.QuestionRepository;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private MicroTopicRepository microTopicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/test")
    public ResponseEntity<String> adminTest() {
        return ResponseEntity.ok("Admin access granted");
    }

    @GetMapping("/migration/status")
    public ResponseEntity<Map<String, Long>> getMigrationStatus() {
        Map<String, Long> status = new HashMap<>();
        // Note: checking counts
        status.put("microTopics", microTopicRepository.countByIsDeletedFalse());
        status.put("questions", questionRepository.countByIsDeletedFalse());
        return ResponseEntity.ok(status);
    }
}
