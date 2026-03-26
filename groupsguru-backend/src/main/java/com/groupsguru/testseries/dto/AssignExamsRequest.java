package com.groupsguru.testseries.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignExamsRequest {
    private List<Long> examIds;
}
