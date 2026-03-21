package com.lms.exam.dto;

import com.lms.question.Question;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AttemptStartResponse {
    private Long attemptId;
    private Long examId;
    private String examName;
    private String examNameTe;
    private Integer durationMinutes;
    private List<Question> questions; // Note: Frontend will use this, but we should strip correct answers later for production.
}
