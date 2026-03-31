package com.groupsguru.content.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
@Data
public class StudyMaterialRequest {
    @NotBlank private String title;
    private String titleTe;
    private String description;
    private String descriptionTe;
    private String entityType;
    @NotNull private Long entityId;
    private String fileType;
    private String subject;
    private String accessType;
    private Double priceInr;
    private Boolean isPublished;
    private Integer displayOrder;
}
