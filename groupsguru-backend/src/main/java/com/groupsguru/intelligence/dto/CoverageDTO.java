package com.groupsguru.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoverageDTO {
    private String subject;
    private long totalTopics;
    private long coveredTopics;
    private double coveragePercentage;
    private long totalQuestions;
}
