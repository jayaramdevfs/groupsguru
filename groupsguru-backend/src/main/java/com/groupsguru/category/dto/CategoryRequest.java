package com.groupsguru.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    
    @NotBlank(message = "Telugu name is required")
    private String nameTe;
    
    private String description;
    private String descriptionTe;
    private String imageUrl;
    
    private Long commissionId;
    private Boolean isPublished;
    private Integer displayOrder;
}
