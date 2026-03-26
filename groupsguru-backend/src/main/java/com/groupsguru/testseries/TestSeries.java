package com.groupsguru.testseries;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class TestSeries {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nameTe;
    
    @Column(length = 2000)
    private String description;
    
    @Column(length = 2000)
    private String descriptionTe;

    @Enumerated(EnumType.STRING)
    private SeriesType seriesType;

    // Hierarchy linkage (nullable — series can be linked to any level)
    private Long categoryId;
    private Long subCategoryId;
    private Long sectionId;
    private Long topicId;

    // Monetization
    private String accessType = "FREE"; // FREE or PAID
    private Double priceInr;

    private Integer totalExams = 0;
    private Boolean isActive = true;
    private Boolean isPublished = false;
    private Integer displayOrder = 0;
    private Boolean isDeleted = false;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (accessType == null) accessType = "FREE";
        if (totalExams == null) totalExams = 0;
        if (isActive == null) isActive = true;
        if (isPublished == null) isPublished = false;
        if (displayOrder == null) displayOrder = 0;
        if (isDeleted == null) isDeleted = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
