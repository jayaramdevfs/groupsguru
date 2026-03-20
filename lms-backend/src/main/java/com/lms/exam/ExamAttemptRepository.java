package com.lms.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
    List<ExamAttempt> findByUserIdOrderByStartedAtDesc(Long userId);
    Optional<ExamAttempt> findByIdAndUserId(Long id, Long userId);
}
