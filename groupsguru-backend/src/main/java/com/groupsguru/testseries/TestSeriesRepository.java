package com.groupsguru.testseries;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSeriesRepository extends JpaRepository<TestSeries, Long> {
    List<TestSeries> findByIsDeletedFalse();
    List<TestSeries> findByIsPublishedTrueAndIsActiveTrueAndIsDeletedFalse();
    List<TestSeries> findByCategoryId(Long categoryId);
    long countByIsDeletedFalse();
}
