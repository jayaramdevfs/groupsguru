package com.lms.intelligence;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PredictionEngineService {

    private static final Logger logger = LoggerFactory.getLogger(PredictionEngineService.class);

    @Autowired
    private PredictionScoreRepository predictionScoreRepository;

    @Transactional
    public void recalculateAllScores() {
        List<PredictionScore> scores = predictionScoreRepository.findAll();
        for (PredictionScore ps : scores) {
            double formulaScore = 0.30 * getValue(ps.getFrequencyScore())
                    + 0.15 * getValue(ps.getDepthScore())
                    + 0.25 * getValue(ps.getRecurrenceScore())
                    + 0.15 * getValue(ps.getSyllabusPriority())
                    + 0.15 * getValue(ps.getTrendMomentum());

            // Limit bounds 0.0 to 1.0
            formulaScore = Math.max(0.0, Math.min(1.0, formulaScore));
            ps.setPredictionConfidence((double) Math.round(formulaScore * 100) / 100.0);

            // Update priority
            if (formulaScore >= 0.70) {
                ps.setPriorityRank("VERY_HIGH");
            } else if (formulaScore >= 0.50) {
                ps.setPriorityRank("HIGH");
            } else if (formulaScore >= 0.30) {
                ps.setPriorityRank("MEDIUM");
            } else {
                ps.setPriorityRank("LOW");
            }

            predictionScoreRepository.save(ps);
        }
        logger.info("Recalculated {} prediction scores.", scores.size());
    }

    public List<PredictionScore> getTopPredictions(String subject, int limit) {
        // We will just do a simple findBySubject and subList, 
        // Or if we need pagination, we use PageRequest in the repository.
        List<PredictionScore> all = predictionScoreRepository.findBySubjectOrderByPredictionConfidenceDesc(subject);
        return all.stream().limit(limit).toList();
    }

    public List<PredictionScore> getPredictionsByPriority(String rank) {
        return predictionScoreRepository.findByPriorityRank(rank);
    }

    private double getValue(Double value) {
        return value == null ? 0.0 : value;
    }
}
