package com.groupsguru.topic;

import com.groupsguru.topic.dto.TopicRequest;
import com.groupsguru.topic.dto.TopicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/topics")
@RequiredArgsConstructor
public class AdminTopicController {

    private final TopicService topicService;

    @GetMapping
    public List<TopicResponse> getAllTopics() {
        return topicService.getAllTopics(true);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTopicCount() {
        long count = topicService.getAllTopics(true).size();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping
    public ResponseEntity<TopicResponse> createTopic(@RequestBody TopicRequest request) {
        return ResponseEntity.ok(topicService.createTopic(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TopicResponse> updateTopicPut(@PathVariable Long id, @RequestBody TopicRequest request) {
        return ResponseEntity.ok(topicService.updateTopic(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TopicResponse> updateTopicPatch(@PathVariable Long id, @RequestBody TopicRequest request) {
        return ResponseEntity.ok(topicService.updateTopic(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-publish")
    public ResponseEntity<TopicResponse> togglePublish(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.togglePublish(id));
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody List<java.util.Map<String, Object>> items) {
        topicService.reorder(items);
        return ResponseEntity.ok().build();
    }
}
