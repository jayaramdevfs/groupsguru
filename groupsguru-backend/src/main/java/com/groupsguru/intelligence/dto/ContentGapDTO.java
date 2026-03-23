package com.groupsguru.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentGapDTO {
    private String microTopicId;
    private String microTopicText;
    private String subject;
    private Double predictionConfidence;
    private String priorityRank;
    private long questionCount;
}
