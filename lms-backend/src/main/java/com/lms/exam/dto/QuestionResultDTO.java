package com.lms.exam.dto;

import com.lms.question.Question;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResultDTO {
    private Question question;
    private String selectedOption;
    private Boolean isCorrect;
    private Double marks;
}
