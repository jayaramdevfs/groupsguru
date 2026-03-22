package com.groupsguru.topic;

import com.groupsguru.topic.dto.TopicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    // GET /api/topics — all topics (public)
    @GetMapping
    public List<TopicResponse> getAllTopics() {
        return topicService.getAllTopics(false);
    }

    // GET /api/topics/section/{id} — topics by section (public)
    @GetMapping("/section/{sectionId}")
    public List<TopicResponse> getTopicsBySection(@PathVariable Long sectionId) {
        return topicService.getTopicsBySection(sectionId, false);
    }
}
