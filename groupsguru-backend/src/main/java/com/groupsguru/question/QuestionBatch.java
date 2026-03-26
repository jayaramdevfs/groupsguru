package com.groupsguru.question;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class QuestionBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String batchName;
    private String fileName;
    private String fileFormat; // XML, CSV, JSON
    private Integer totalQuestions = 0;
    private Integer successCount = 0;
    private Integer failCount = 0;
    private String status; // UPLOADED, REVIEWING, APPROVED, REJECTED
    private Long uploadedBy; // userId
    private Long reviewedBy; // userId
    private LocalDateTime uploadedAt;
    private LocalDateTime reviewedAt;

    @Column(length = 5000)
    private String notes; // error details, validation messages

    private Boolean isDeleted = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        uploadedAt = LocalDateTime.now();
        if (isDeleted == null) isDeleted = false;
        if (status == null) status = "UPLOADED";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
