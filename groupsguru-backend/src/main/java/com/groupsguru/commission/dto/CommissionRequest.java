package com.groupsguru.commission.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommissionRequest {
    @NotBlank(message = "Code is required")
    private String code;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Telugu name is required")
    private String nameTe;
    
    private String description;
    private String descriptionTe;
    private String imageUrl;
    private Integer displayOrder;
    private String accessType;
    private Double priceInr;
    private Boolean isActive;
}
