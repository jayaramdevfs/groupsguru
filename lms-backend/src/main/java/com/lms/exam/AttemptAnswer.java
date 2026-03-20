package com.lms.exam;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class AttemptAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long attemptId;

    @Column(nullable = false)
    private Long questionId;

    private String selectedOption; // null if unattempted

    private Boolean isCorrect;

    private Double marks;
}
