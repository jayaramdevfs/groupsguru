package com.lms.registry.dto;

import lombok.Data;

@Data
public class CreateMicroTopicRequest {
    private String microTopicId;
    private String subject;
    private String sectionName;
    private String topicName;
    private String microTopicText;
    private String syllabusRef;
    private String groupApplicability;
    private String depthLevel;
    private String contentType;
    private String topicCategory;
    private String pyqFrequency;
    private String difficultyTrend;
    private String predictionPriority;
    private String dataConfidence;
    private String prelimsOrMains;
    private String paper;
    private Long topicId;
}
