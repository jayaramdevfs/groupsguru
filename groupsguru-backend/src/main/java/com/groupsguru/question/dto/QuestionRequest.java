package com.groupsguru.question.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
@Data
public class QuestionRequest {
    private String questionCode;
    @NotBlank private String questionTextEn;
    private String questionTextTe;
    @NotBlank private String optionAEn;
    private String optionATe;
    @NotBlank private String optionBEn;
    private String optionBTe;
    @NotBlank private String optionCEn;
    private String optionCTe;
    @NotBlank private String optionDEn;
    private String optionDTe;
    @NotBlank private String correctOption;
    private String explanationEn;
    private String explanationTe;
    @NotBlank private String microTopicId;
    private String subject;
    private String difficulty;
    private String cognitiveLevel;
    private String questionType;
    private String sprintId;
    private Double penalty;
}
