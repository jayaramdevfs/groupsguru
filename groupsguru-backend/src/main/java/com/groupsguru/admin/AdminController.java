package com.groupsguru.admin;

import com.groupsguru.registry.MicroTopicRepository;
import com.groupsguru.question.QuestionRepository;
import com.groupsguru.migration.MaterialMigrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private MicroTopicRepository microTopicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private MaterialMigrationService materialMigrationService;

    @GetMapping("/test")
    public ResponseEntity<String> adminTest() {
        return ResponseEntity.ok("Admin access granted");
    }

    @GetMapping("/migration/status")
    public ResponseEntity<Map<String, Long>> getMigrationStatus() {
        Map<String, Long> status = new HashMap<>();
        status.put("microTopics", microTopicRepository.countByIsDeletedFalse());
        status.put("questions", questionRepository.countByIsDeletedFalse());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/migration/sync-materials")
    public ResponseEntity<String> syncMaterials() {
        return ResponseEntity.ok(materialMigrationService.syncMaterialsFromDisk());
    }
}
