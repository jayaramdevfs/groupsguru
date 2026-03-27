package com.groupsguru.category.dto;

import com.groupsguru.category.Category;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String imageUrl;
    private Long commissionId;
    private String accessType;
    private Double priceInr;
    private Double prelimsPriceInr;
    private Double mainsPriceInr;
    private boolean isPublished;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CategoryResponse fromEntity(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .nameTe(category.getNameTe())
                .description(category.getDescription())
                .descriptionTe(category.getDescriptionTe())
                .imageUrl(category.getImageUrl())
                .commissionId(category.getCommissionId())
                .accessType(category.getAccessType())
                .priceInr(category.getPriceInr())
                .prelimsPriceInr(category.getPrelimsPriceInr())
                .mainsPriceInr(category.getMainsPriceInr())
                .isPublished(category.isPublished())
                .displayOrder(category.getDisplayOrder())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
