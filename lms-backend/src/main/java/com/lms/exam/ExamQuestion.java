package com.lms.exam;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ExamQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long examId;

    @Column(nullable = false)
    private Long questionId;

    private Integer questionOrder;
}
