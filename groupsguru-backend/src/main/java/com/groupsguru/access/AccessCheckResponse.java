package com.groupsguru.access;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AccessCheckResponse {
    private boolean hasAccess;
    private Double price;
    private List<ParentOption> parentOptions;

    @Data
    @Builder
    public static class ParentOption {
        private String entityType;
        private Long entityId;
        private String name;
        private Double price;
    }
}
