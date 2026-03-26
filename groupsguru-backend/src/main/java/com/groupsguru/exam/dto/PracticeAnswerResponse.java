package com.groupsguru.exam.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PracticeAnswerResponse {
    private boolean isCorrect;
    private String correctOption;
    private String explanationEn;
    private String explanationTe;
}
