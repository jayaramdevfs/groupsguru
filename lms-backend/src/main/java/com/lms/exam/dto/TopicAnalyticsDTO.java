package com.lms.exam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopicAnalyticsDTO {
    private String topicName;
    private int totalQuestions;
    private int correctCount;
    private int wrongCount;
    private int unattemptedCount;
    private double hitRate; // (correct / total) * 100
}
