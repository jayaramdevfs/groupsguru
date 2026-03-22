package com.groupsguru.section.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionRequest {
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String sectionCode;
    private Long subCategoryId;
    private Boolean isPublished;
    private Integer displayOrder;
}
