package com.lms.exam.dto;

import com.lms.exam.ExamAttempt;
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
