package com.lms.registry;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "micro_topic")
@Data
@NoArgsConstructor
public class MicroTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String microTopicId;

    @Column(nullable = false)
    private String subject;

    private String sectionName;
    private String topicName;

    @Column(length = 2000)
    private String microTopicText;

    @Column(length = 2000)
    private String syllabusRef;

    private String groupApplicability;
    private String depthLevel;
    private String contentType;
    private String topicCategory;

    private String pyqFrequency;
    private String difficultyTrend;
    private String predictionPriority;
    
    @Column(nullable = false)
    private String dataConfidence;

    private String prelimsOrMains;
    private String paper;

    private Long topicId; // Optional link to Topic entity

    @Column(nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
