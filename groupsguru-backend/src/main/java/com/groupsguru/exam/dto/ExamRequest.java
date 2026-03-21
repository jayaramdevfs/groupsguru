package com.groupsguru.exam.dto;

import com.groupsguru.exam.ExamType;
import lombok.Data;

@Data
public class ExamRequest {
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private ExamType examType;
    private String subject;
    private Integer totalQuestions;
    private Integer durationMinutes;
    private Boolean negativeMarking;
    private Double penaltyPerWrong;
    private Double marksPerQuestion;
    private Boolean isActive;
}
