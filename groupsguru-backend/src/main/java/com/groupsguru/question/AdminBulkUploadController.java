package com.groupsguru.question;

import com.groupsguru.auth.AuthService;
import com.groupsguru.auth.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/questions/bulk")
public class AdminBulkUploadController {

    private final BulkUploadService bulkUploadService;
    private final QuestionBatchRepository batchRepository;
    private final AuthService authService;

    public AdminBulkUploadController(BulkUploadService bulkUploadService,
                                     QuestionBatchRepository batchRepository,
                                     AuthService authService) {
        this.bulkUploadService = bulkUploadService;
        this.batchRepository = batchRepository;
        this.authService = authService;
    }

    @PostMapping("/upload")
    public ResponseEntity<QuestionBatch> upload(@RequestParam("file") MultipartFile file) throws Exception {
        User currentUser = authService.getCurrentUser();
        QuestionBatch batch = bulkUploadService.uploadAndParse(file, currentUser.getId());
        return ResponseEntity.ok(batch);
    }

    @GetMapping("/batches")
    public ResponseEntity<Page<QuestionBatch>> getBatches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(batchRepository.findByIsDeletedFalseOrderByCreatedAtDesc(PageRequest.of(page, size)));
    }

    @GetMapping("/batches/{id}")
    public ResponseEntity<QuestionBatch> getBatch(@PathVariable Long id) {
        return batchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/batches/{id}/questions")
    public ResponseEntity<List<Question>> getBatchQuestions(@PathVariable Long id) {
        return ResponseEntity.ok(bulkUploadService.getBatchQuestions(id));
    }

    @PutMapping("/batches/{id}/approve")
    public ResponseEntity<QuestionBatch> approveBatch(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(bulkUploadService.approveBatch(id, currentUser.getId()));
    }

    @PutMapping("/batches/{id}/reject")
    public ResponseEntity<QuestionBatch> rejectBatch(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(bulkUploadService.rejectBatch(id, currentUser.getId()));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(batchRepository.countByIsDeletedFalse());
    }
}
