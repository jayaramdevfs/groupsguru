package com.lms.intelligence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PyqAnalysisRepository extends JpaRepository<PyqAnalysis, Long> {
    boolean existsByPyqId(String pyqId);
}
