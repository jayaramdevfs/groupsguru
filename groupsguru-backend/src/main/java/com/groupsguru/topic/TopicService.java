package com.groupsguru.topic;

import com.groupsguru.section.Section;
import com.groupsguru.section.SectionRepository;
import com.groupsguru.topic.dto.TopicRequest;
import com.groupsguru.topic.dto.TopicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final SectionRepository sectionRepository;

    @Transactional(readOnly = true)
    public List<TopicResponse> getAllTopics() {
        return topicRepository.findByIsDeletedFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TopicResponse> getTopicsBySection(Long sectionId) {
        return topicRepository.findBySectionIdAndIsDeletedFalse(Objects.requireNonNull(sectionId)).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TopicResponse createTopic(TopicRequest request) {
        Section section = sectionRepository.findById(Objects.requireNonNull(request.getSectionId()))
                .orElseThrow(() -> new RuntimeException("Section not found"));

        Topic topic = Topic.builder()
                .name(request.getName())
                .nameTe(request.getNameTe())
                .description(request.getDescription())
                .descriptionTe(request.getDescriptionTe())
                .topicCode(request.getTopicCode())
                .section(section)
                .build();

        return mapToResponse(topicRepository.save(topic));
    }

    @Transactional
    public TopicResponse updateTopic(Long id, TopicRequest request) {
        Topic topic = topicRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        topic.setName(request.getName());
        topic.setNameTe(request.getNameTe());
        topic.setDescription(request.getDescription());
        topic.setDescriptionTe(request.getDescriptionTe());
        topic.setTopicCode(request.getTopicCode());

        if (!topic.getSection().getId().equals(request.getSectionId())) {
            Section section = sectionRepository.findById(Objects.requireNonNull(request.getSectionId()))
                    .orElseThrow(() -> new RuntimeException("Section not found"));
            topic.setSection(section);
        }

        return mapToResponse(topicRepository.save(topic));
    }

    @Transactional
    public void deleteTopic(Long id) {
        Topic topic = topicRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        topic.setDeleted(true);
        topicRepository.save(topic);
    }

    private TopicResponse mapToResponse(Topic topic) {
        Section section = topic.getSection();
        return TopicResponse.builder()
                .id(topic.getId())
                .name(topic.getName())
                .nameTe(topic.getNameTe())
                .description(topic.getDescription())
                .descriptionTe(topic.getDescriptionTe())
                .topicCode(topic.getTopicCode())
                .sectionId(section.getId())
                .sectionName(section.getName())
                .subCategoryId(section.getSubCategory().getId())
                .subCategoryName(section.getSubCategory().getName())
                .accessType(topic.getAccessType())
                .priceInr(topic.getPriceInr())
                .createdAt(topic.getCreatedAt())
                .updatedAt(topic.getUpdatedAt())
                .build();
    }
}
