package com.groupsguru.intelligence;

import com.groupsguru.intelligence.dto.ContentGapDTO;
import com.groupsguru.intelligence.dto.CoverageDTO;
import com.groupsguru.question.QuestionRepository;
import com.groupsguru.registry.MicroTopic;
import com.groupsguru.registry.MicroTopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PredictionEngineService {

    private static final Logger logger = LoggerFactory.getLogger(PredictionEngineService.class);

    @Autowired
    private PredictionScoreRepository predictionScoreRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private MicroTopicRepository microTopicRepository;

    @Transactional
    public void recalculateAllScores() {
// ... existing code ...
    }

    public List<PredictionScore> getTopPredictions(String subject, int limit) {
        List<PredictionScore> all = predictionScoreRepository.findBySubjectOrderByPredictionConfidenceDesc(subject);
        return all.stream().limit(limit).toList();
    }

    public List<PredictionScore> getPredictionsByPriority(String rank) {
        return predictionScoreRepository.findByPriorityRank(rank);
    }

    public List<ContentGapDTO> getContentGaps() {
        List<PredictionScore> scores = predictionScoreRepository.findAll();
        List<ContentGapDTO> gaps = new ArrayList<>();

        for (PredictionScore ps : scores) {
            long count = questionRepository.countByMicroTopicIdAndIsDeletedFalse(ps.getMicroTopicId());
            if (count == 0) {
                // Find micro-topic text
                String text = microTopicRepository.findByMicroTopicIdAndIsDeletedFalse(ps.getMicroTopicId())
                        .map(MicroTopic::getMicroTopicText)
                        .orElse("N/A");

                gaps.add(ContentGapDTO.builder()
                        .microTopicId(ps.getMicroTopicId())
                        .microTopicText(text)
                        .subject(ps.getSubject())
                        .predictionConfidence(ps.getPredictionConfidence())
                        .priorityRank(ps.getPriorityRank())
                        .questionCount(0)
                        .build());
            }
        }

        return gaps.stream()
                .sorted(Comparator.comparingDouble(ContentGapDTO::getPredictionConfidence).reversed())
                .limit(50)
                .toList();
    }

    public List<CoverageDTO> getCoverageStats() {
        List<MicroTopic> allTopics = microTopicRepository.findAll();
        
        // Group by subject
        Map<String, List<MicroTopic>> bySubject = allTopics.stream()
                .collect(Collectors.groupingBy(MicroTopic::getSubject));

        List<CoverageDTO> stats = new ArrayList<>();
        for (Map.Entry<String, List<MicroTopic>> entry : bySubject.entrySet()) {
            String subject = entry.getKey();
            List<MicroTopic> topics = entry.getValue();

            long totalTopics = topics.size();
            long coveredTopics = 0;
            long totalQuestions = 0;

            for (MicroTopic mt : topics) {
                long qCount = questionRepository.countByMicroTopicIdAndIsDeletedFalse(mt.getMicroTopicId());
                if (qCount > 0) {
                    coveredTopics++;
                    totalQuestions += qCount;
                }
            }

            stats.add(CoverageDTO.builder()
                    .subject(subject)
                    .totalTopics(totalTopics)
                    .coveredTopics(coveredTopics)
                    .coveragePercentage(totalTopics > 0 ? (double) coveredTopics / totalTopics * 100 : 0)
                    .totalQuestions(totalQuestions)
                    .build());
        }

        return stats;
    }

    @Transactional
    public void updateNotes(Long id, String notes) {
        predictionScoreRepository.findById(id).ifPresent(ps -> {
            ps.setNotes(notes);
            predictionScoreRepository.save(ps);
        });
    }

    @Transactional
    public void updatePriorityRank(Long id, String rank) {
        predictionScoreRepository.findById(id).ifPresent(ps -> {
            ps.setPriorityRank(rank);
            predictionScoreRepository.save(ps);
        });
    }

    private double getValue(Double value) {
        return value == null ? 0.0 : value;
    }
}
