package com.groupsguru.exam;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ExamAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long examId;

    @Column(nullable = false)
    private Long userId;

    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime submittedAt;

    private Double totalMarks;

    private Integer correctCount;

    private Integer wrongCount;

    private Integer unattemptedCount;

    @Enumerated(EnumType.STRING)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        startedAt = LocalDateTime.now();
        if (status == null) status = AttemptStatus.IN_PROGRESS;
    }
}
