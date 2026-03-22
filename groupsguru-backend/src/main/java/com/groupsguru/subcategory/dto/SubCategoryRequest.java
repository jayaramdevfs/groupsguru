package com.groupsguru.subcategory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryRequest {
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String syllabusCode;
    private Long categoryId;
    private Boolean isPublished;
    private Integer displayOrder;
}
