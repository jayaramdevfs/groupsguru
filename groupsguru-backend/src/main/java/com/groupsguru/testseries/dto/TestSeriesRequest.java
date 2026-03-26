package com.groupsguru.testseries.dto;

import com.groupsguru.testseries.SeriesType;
import lombok.Data;

@Data
public class TestSeriesRequest {
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private SeriesType seriesType;
    
    private Long categoryId;
    private Long subCategoryId;
    private Long sectionId;
    private Long topicId;

    private String accessType;
    private Double priceInr;

    private Integer totalExams;
    private Boolean isActive;
    private Boolean isPublished;
    private Integer displayOrder;
}
