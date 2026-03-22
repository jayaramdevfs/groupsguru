package com.groupsguru.question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService service;

    @GetMapping
    public ResponseEntity<Page<Question>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String questionType,
            @RequestParam(required = false) String sprintId,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getAll(pageable, subject, difficulty, questionType, sprintId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/code/{questionCode}")
    public ResponseEntity<Question> getByQuestionCode(@PathVariable String questionCode) {
        return ResponseEntity.ok(service.getByQuestionCode(questionCode));
    }
    
    @GetMapping("/micro-topic/{microTopicId}")
    public ResponseEntity<java.util.List<Question>> getByMicroTopicId(@PathVariable String microTopicId) {
        return ResponseEntity.ok(service.getByMicroTopicId(microTopicId));
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(service.getCount());
    }
}
