package com.groupsguru.exam;

import com.groupsguru.exam.dto.ExamRequest;
import com.groupsguru.exam.dto.AssignQuestionsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/exams")
public class AdminExamController {

    @Autowired
    private ExamService service;

    @GetMapping
    public ResponseEntity<List<Exam>> getAll() {
        return ResponseEntity.ok(service.getAllForAdmin());
    }

    @PostMapping
    public ResponseEntity<Exam> create(@RequestBody ExamRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> update(@PathVariable Long id, @RequestBody ExamRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/assign-questions")
    public ResponseEntity<Void> assignQuestions(@PathVariable Long id, @RequestBody AssignQuestionsRequest request) {
        service.assignQuestions(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/assigned-questions")
    public ResponseEntity<List<Long>> getAssignedQuestionIds(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAssignedQuestionIds(id));
    }
}
