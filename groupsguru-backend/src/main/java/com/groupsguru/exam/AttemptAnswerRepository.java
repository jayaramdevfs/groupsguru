package com.groupsguru.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {
    List<AttemptAnswer> findByAttemptId(Long attemptId);
}
