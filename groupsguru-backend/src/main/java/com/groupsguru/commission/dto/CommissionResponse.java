package com.groupsguru.commission.dto;

import com.groupsguru.commission.Commission;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CommissionResponse {
    private Long id;
    private String code;
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String imageUrl;
    private Integer displayOrder;
    private String accessType;
    private Double priceInr;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommissionResponse fromEntity(Commission c) {
        return CommissionResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .name(c.getName())
                .nameTe(c.getNameTe())
                .description(c.getDescription())
                .descriptionTe(c.getDescriptionTe())
                .imageUrl(c.getImageUrl())
                .displayOrder(c.getDisplayOrder())
                .accessType(c.getAccessType())
                .priceInr(c.getPriceInr())
                .isActive(c.isActive())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
