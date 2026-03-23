package com.groupsguru.intelligence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/intelligence")
public class IntelligenceController {

    @Autowired
    private PredictionEngineService predictionEngineService;
    
    @Autowired
    private PredictionScoreRepository predictionScoreRepository;
    
    @Autowired
    private PyqAnalysisRepository pyqAnalysisRepository;

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

    @GetMapping("/content-gaps")
    public List<com.groupsguru.intelligence.dto.ContentGapDTO> getContentGaps() {
        return predictionEngineService.getContentGaps();
    }

    @GetMapping("/coverage")
    public List<com.groupsguru.intelligence.dto.CoverageDTO> getCoverage() {
        return predictionEngineService.getCoverageStats();
    }

    @PutMapping("/predictions/{id}/notes")
    public Map<String, String> updateNotes(@PathVariable Long id, @RequestBody Map<String, String> body) {
        predictionEngineService.updateNotes(id, body.get("notes"));
        return Map.of("message", "Notes updated successfully");
    }

    @PutMapping("/predictions/{id}/priority-tweak")
    public Map<String, String> updatePriority(@PathVariable Long id, @RequestBody Map<String, String> body) {
        predictionEngineService.updatePriorityRank(id, body.get("priority"));
        return Map.of("message", "Priority rank updated successfully");
    }
}
