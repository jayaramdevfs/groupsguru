package com.groupsguru.content.dto;

import lombok.Data;

@Data
public class StudyMaterialRequest {
    private String title;
    private String titleTe;
    private String description;
    private String descriptionTe;
    private String entityType;
    private Long entityId;
    private String fileType;
    private String subject;
    private String accessType;
    private Double priceInr;
    private Boolean isPublished;
    private Integer displayOrder;
}
