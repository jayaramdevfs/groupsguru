package com.lms.exam;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String nameTe;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String descriptionTe;

    @Enumerated(EnumType.STRING)
    private ExamType examType; // TOPIC_WISE/SECTION_WISE/SUBJECT_WISE/FULL_LENGTH_TEST

    private String subject; // nullable — null for FLT

    private Integer totalQuestions;

    private Integer durationMinutes;

    private Boolean negativeMarking = true;

    private Double penaltyPerWrong = 0.25;

    private Double marksPerQuestion = 1.0;

    private Boolean isActive = true;

    private Boolean isDeleted = false;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "sub_category_id")
    private Long subCategoryId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "topic_id")
    private Long topicId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (negativeMarking == null) negativeMarking = true;
        if (penaltyPerWrong == null) penaltyPerWrong = 0.25;
        if (marksPerQuestion == null) marksPerQuestion = 1.0;
        if (isActive == null) isActive = true;
        if (isDeleted == null) isDeleted = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
