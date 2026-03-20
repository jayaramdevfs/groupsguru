package com.lms.section.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionResponse {
    private Long id;
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String sectionCode;
    private Long subCategoryId;
    private String subCategoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
