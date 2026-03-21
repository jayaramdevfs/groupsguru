package com.groupsguru.exam;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByIsDeletedFalse();
    List<Exam> findByIsActiveTrueAndIsDeletedFalse();
    List<Exam> findByExamTypeAndIsDeletedFalse(ExamType examType);
}
