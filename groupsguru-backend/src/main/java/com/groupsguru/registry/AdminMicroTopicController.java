package com.groupsguru.registry;

import com.groupsguru.registry.dto.CreateMicroTopicRequest;
import com.groupsguru.registry.dto.UpdateMicroTopicRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/registry/micro-topics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMicroTopicController {

    @Autowired
    private MicroTopicService service;

    @GetMapping
    public ResponseEntity<Page<MicroTopic>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String paper,
            @RequestParam(required = false) String groupApplicability) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getAll(pageable, subject, paper, groupApplicability));
    }

    @PostMapping
    public ResponseEntity<MicroTopic> create(@RequestBody CreateMicroTopicRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PatchMapping("/{microTopicId}")
    public ResponseEntity<MicroTopic> update(@PathVariable String microTopicId, @RequestBody UpdateMicroTopicRequest request) {
        return ResponseEntity.ok(service.update(microTopicId, request));
    }

    @DeleteMapping("/{microTopicId}")
    public ResponseEntity<Void> delete(@PathVariable String microTopicId) {
        service.delete(microTopicId);
        return ResponseEntity.noContent().build();
    }
}
