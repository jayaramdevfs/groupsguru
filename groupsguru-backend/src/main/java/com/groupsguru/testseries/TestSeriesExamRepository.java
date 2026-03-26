package com.groupsguru.testseries;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSeriesExamRepository extends JpaRepository<TestSeriesExam, Long> {
    List<TestSeriesExam> findByTestSeriesIdOrderBySequenceNumber(Long testSeriesId);
    void deleteByTestSeriesId(Long testSeriesId);
    long countByTestSeriesId(Long testSeriesId);
}
