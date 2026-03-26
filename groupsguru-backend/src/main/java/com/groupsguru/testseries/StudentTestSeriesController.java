package com.groupsguru.testseries;

import com.groupsguru.testseries.dto.TestSeriesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/test-series")
public class StudentTestSeriesController {

    @Autowired
    private TestSeriesService testSeriesService;

    @GetMapping
    public ResponseEntity<List<TestSeries>> getAll() {
        return ResponseEntity.ok(testSeriesService.getAllForStudent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestSeries> getById(@PathVariable Long id) {
        return ResponseEntity.ok(testSeriesService.getById(id));
    }

    @GetMapping("/{id}/exams")
    public ResponseEntity<?> getSeriesExams(@PathVariable Long id) {
        return ResponseEntity.ok(testSeriesService.getSeriesExams(id));
    }
}
