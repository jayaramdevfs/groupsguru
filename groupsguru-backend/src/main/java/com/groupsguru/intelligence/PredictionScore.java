package com.groupsguru.intelligence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String microTopicId;

    private String subject;

    private Double frequencyScore;
    private Double depthScore;
    private Double recurrenceScore;
    private Double caLinkedBoost;
    private Double syllabusPriority;
    private Double trendMomentum;
    private Double commissionBlendAppsc;
    private Double commissionBlendUpsc;

    private String dataConfidence;
    
    // FINAL SCORE 0–1
    private Double predictionConfidence;
    
    // VERY_HIGH/HIGH/MEDIUM/LOW
    private String priorityRank;
    
    @Column(length = 2000)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
