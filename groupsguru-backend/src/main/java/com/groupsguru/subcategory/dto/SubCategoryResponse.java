package com.groupsguru.subcategory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryResponse {
    private Long id;
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String syllabusCode;
    private Long categoryId;
    private String categoryName;
    private String accessType;
    private Double priceInr;
    private String phase;
    private boolean isPublished;
    private Integer displayOrder;
}
