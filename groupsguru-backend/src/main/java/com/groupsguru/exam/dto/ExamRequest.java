package com.groupsguru.exam.dto;

import com.groupsguru.exam.ExamType;
import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ExamRequest {
    @NotBlank private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    @NotNull private ExamType examType;
    private String subject;
    private Integer totalQuestions;
    @Positive private Integer durationMinutes;
    private Boolean negativeMarking;
    private Double penaltyPerWrong;
    private Double marksPerQuestion;
    private Boolean isActive;
    
    private Long categoryId;
    private Long subCategoryId;
    private Long sectionId;
    private Long topicId;
}
