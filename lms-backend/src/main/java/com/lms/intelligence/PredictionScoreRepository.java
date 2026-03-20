package com.lms.intelligence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionScoreRepository extends JpaRepository<PredictionScore, Long> {
    List<PredictionScore> findBySubjectOrderByPredictionConfidenceDesc(String subject);
    List<PredictionScore> findByPriorityRank(String priorityRank);
    boolean existsByMicroTopicId(String microTopicId);
}
