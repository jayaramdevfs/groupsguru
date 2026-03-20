package com.lms.question.dto;

import lombok.Data;

@Data
public class QuestionRequest {
    private String questionCode;
    private String questionTextEn;
    private String questionTextTe;
    private String optionAEn;
    private String optionATe;
    private String optionBEn;
    private String optionBTe;
    private String optionCEn;
    private String optionCTe;
    private String optionDEn;
    private String optionDTe;
    private String correctOption;
    private String explanationEn;
    private String explanationTe;
    private String microTopicId;
    private String subject;
    private String difficulty;
    private String cognitiveLevel;
    private String questionType;
    private String sprintId;
    private Double penalty;
}
