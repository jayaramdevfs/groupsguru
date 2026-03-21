package com.groupsguru.intelligence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/intelligence")
public class IntelligenceController {

    @Autowired
    private PredictionScoreRepository predictionScoreRepository;

    @Autowired
    private PyqAnalysisRepository pyqAnalysisRepository;

    @Autowired
    private PredictionEngineService predictionEngineService;

    @GetMapping("/predictions")
    public List<PredictionScore> getAllPredictions() {
        return predictionScoreRepository.findAll();
    }

    @GetMapping("/predictions/top")
    public List<PredictionScore> getTopPredictions(
            @RequestParam(defaultValue = "History") String subject,
            @RequestParam(defaultValue = "10") int limit) {
        return predictionEngineService.getTopPredictions(subject, limit);
    }

    @GetMapping("/predictions/by-priority/{rank}")
    public List<PredictionScore> getPredictionsByPriority(@PathVariable String rank) {
        return predictionEngineService.getPredictionsByPriority(rank);
    }

    @PostMapping("/predictions/recalculate")
    public Map<String, String> recalculateScores() {
        predictionEngineService.recalculateAllScores();
        return Map.of("message", "Recalculation successful");
    }

    @GetMapping("/pyq-analysis")
    public List<PyqAnalysis> getAllPyqAnalysis() {
        return pyqAnalysisRepository.findAll();
    }

    @GetMapping("/pyq-analysis/stats")
    public Map<String, Long> getPyqStats() {
        return Map.of("totalPyqs", pyqAnalysisRepository.count());
    }
}
