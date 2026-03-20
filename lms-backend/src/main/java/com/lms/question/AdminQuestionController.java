package com.lms.question;

import com.lms.question.dto.QuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/questions")
public class AdminQuestionController {

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

    @PostMapping
    public ResponseEntity<Question> create(@RequestBody QuestionRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> update(@PathVariable Long id, @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
