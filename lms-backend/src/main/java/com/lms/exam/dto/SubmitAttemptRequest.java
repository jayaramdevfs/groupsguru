package com.lms.exam.dto;

import lombok.Data;
import java.util.List;

@Data
public class SubmitAttemptRequest {
    private List<AnswerDTO> answers;

    @Data
    public static class AnswerDTO {
        private Long questionId;
        private String selectedOption; // null if unattempted
    }
}
