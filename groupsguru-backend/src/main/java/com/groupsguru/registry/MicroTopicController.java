package com.groupsguru.registry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registry/micro-topics")
public class MicroTopicController {

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

    @GetMapping("/{microTopicId}")
    public ResponseEntity<MicroTopic> getByMicroTopicId(@PathVariable String microTopicId) {
        return ResponseEntity.ok(service.getByMicroTopicId(microTopicId));
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<java.util.List<MicroTopic>> getByTopicId(@PathVariable Long topicId) {
        return ResponseEntity.ok(service.getByTopicId(topicId));
    }
}
