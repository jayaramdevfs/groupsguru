package com.groupsguru.exam.dto;

import lombok.Data;

@Data
public class PracticeAnswerRequest {
    private Long questionId;
    private String selectedOption;
}
