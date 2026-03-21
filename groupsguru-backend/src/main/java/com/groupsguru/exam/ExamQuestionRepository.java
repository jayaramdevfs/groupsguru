package com.groupsguru.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {
    List<ExamQuestion> findByExamId(Long examId);
    List<ExamQuestion> findByExamIdOrderByQuestionOrder(Long examId);
    void deleteByExamId(Long examId);
}
