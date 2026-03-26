package com.groupsguru.testseries;

import com.groupsguru.testseries.dto.AssignExamsRequest;
import com.groupsguru.testseries.dto.AutoGenerateRequest;
import com.groupsguru.testseries.dto.TestSeriesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/test-series")
public class AdminTestSeriesController {

    @Autowired
    private TestSeriesService testSeriesService;

    @GetMapping
    public ResponseEntity<List<TestSeries>> getAll() {
        return ResponseEntity.ok(testSeriesService.getAllForAdmin());
    }

    @PostMapping
    public ResponseEntity<TestSeries> create(@RequestBody TestSeriesRequest request) {
        return ResponseEntity.ok(testSeriesService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestSeries> update(@PathVariable Long id, @RequestBody TestSeriesRequest request) {
        return ResponseEntity.ok(testSeriesService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        testSeriesService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestSeries> getById(@PathVariable Long id) {
        return ResponseEntity.ok(testSeriesService.getById(id));
    }

    @PutMapping("/{id}/exams")
    public ResponseEntity<Void> assignExams(@PathVariable Long id, @RequestBody AssignExamsRequest request) {
        testSeriesService.assignExams(id, request.getExamIds());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/exams")
    public ResponseEntity<?> getSeriesExams(@PathVariable Long id) {
        return ResponseEntity.ok(testSeriesService.getSeriesExams(id));
    }

    @PostMapping("/{id}/auto-generate")
    public ResponseEntity<Void> autoGenerate(@PathVariable Long id, @RequestBody AutoGenerateRequest request) {
        testSeriesService.autoGenerate(id, request.getQuestionsPerExam(), request.getNumExams());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok((long) testSeriesService.getAllForAdmin().size());
    }
}
