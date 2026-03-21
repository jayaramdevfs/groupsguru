package com.groupsguru.exam.dto;

import com.groupsguru.exam.ExamAttempt;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ExamResultDTO {
    private ExamAttempt attempt;
    private List<QuestionResultDTO> questions;
    private List<TopicAnalyticsDTO> topicAnalytics;
}
