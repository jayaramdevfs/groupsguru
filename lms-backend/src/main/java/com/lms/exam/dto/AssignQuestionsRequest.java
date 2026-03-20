package com.lms.exam.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignQuestionsRequest {
    private List<Long> questionIds;
}
