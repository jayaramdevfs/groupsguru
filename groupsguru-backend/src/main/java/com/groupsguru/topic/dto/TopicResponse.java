package com.groupsguru.topic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
    private Long id;
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String topicCode;
    private Long sectionId;
    private String sectionName;      // denormalised for frontend
    private Long subCategoryId;      // bubble up for easy filtering
    private String subCategoryName;
    private String accessType;
    private Double priceInr;
    private boolean isPublished;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
