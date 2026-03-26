package com.groupsguru.question;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String questionCode; // e.g., GG-S11.1-Q01

    @Column(length = 2000)
    private String questionTextEn;

    @Column(length = 2000)
    private String questionTextTe;

    @Column(length = 2000)
    private String optionAEn;
    @Column(length = 2000)
    private String optionATe;
    @Column(length = 2000)
    private String optionBEn;
    @Column(length = 2000)
    private String optionBTe;
    @Column(length = 2000)
    private String optionCEn;
    @Column(length = 2000)
    private String optionCTe;
    @Column(length = 2000)
    private String optionDEn;
    @Column(length = 2000)
    private String optionDTe;

    private String correctOption; // A/B/C/D

    @Column(length = 2000)
    private String explanationEn;

    @Column(length = 2000)
    private String explanationTe;

    private String microTopicId; 
    private String subject;
    private String difficulty; // easy/medium/hard/very_hard
    private String cognitiveLevel; // L1/L2/L3/L4
    private String questionType; // STATIC/ANALYTICAL/STMT/ELIM/etc.
    private String sprintId; // e.g., S11.1
    
    private Long batchId; // FK to QuestionBatch (nullable — existing questions have no batch)
    
    private Double penalty = 0.25;

    private Boolean isDeleted = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (penalty == null) penalty = 0.25;
        if (isDeleted == null) isDeleted = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
