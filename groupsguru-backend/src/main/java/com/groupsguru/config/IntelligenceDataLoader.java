package com.groupsguru.config;

import com.groupsguru.intelligence.PredictionScore;
import com.groupsguru.intelligence.PredictionScoreRepository;
import com.groupsguru.intelligence.PyqAnalysis;
import com.groupsguru.intelligence.PyqAnalysisRepository;
import com.opencsv.CSVReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Component
@Order(2)
public class IntelligenceDataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(IntelligenceDataLoader.class);

    @Autowired
    private PredictionScoreRepository predictionScoreRepository;

    @Autowired
    private PyqAnalysisRepository pyqAnalysisRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        // 1. Load Prediction Scores
        Resource[] predResources = resolver.getResources("classpath*:groupsguru/intelligence/analysis/prediction-scores.csv");
        for (Resource resource : predResources) {
            loadPredictionScores(resource);
        }

        // 2. Load PYQ Analysis
        Resource[] pyqResources = resolver.getResources("classpath*:groupsguru/intelligence/analysis/*-pyq-analysis.csv");
        for (Resource resource : pyqResources) {
            loadPyqAnalysis(resource);
        }
    }

    private void loadPredictionScores(Resource resource) throws Exception {
        int loadedCount = 0;
        String fileName = resource.getFilename();

        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReader(reader)) {

            String[] header = csvReader.readNext(); // Skip header
            if (header == null) return;

            String[] nextLine;
            while ((nextLine = csvReader.readNext()) != null) {
                if (nextLine.length < 13) {
                    throw new RuntimeException("Parse error in " + fileName + ": Expected at least 13 cols, got " + nextLine.length);
                }

                String microTopicId = nextLine[0];
                if (predictionScoreRepository.existsByMicroTopicId(microTopicId)) {
                    continue;
                }

                PredictionScore ps = new PredictionScore();
                ps.setMicroTopicId(microTopicId);
                ps.setSubject(nextLine[1]);
                ps.setFrequencyScore(parseDoubleSafely(nextLine[2]));
                ps.setDepthScore(parseDoubleSafely(nextLine[3]));
                ps.setRecurrenceScore(parseDoubleSafely(nextLine[4]));
                ps.setCaLinkedBoost(parseDoubleSafely(nextLine[5]));
                ps.setSyllabusPriority(parseDoubleSafely(nextLine[6]));
                ps.setTrendMomentum(parseDoubleSafely(nextLine[7]));
                ps.setCommissionBlendAppsc(parseDoubleSafely(nextLine[8]));
                ps.setCommissionBlendUpsc(parseDoubleSafely(nextLine[9]));
                ps.setDataConfidence(nextLine[10]);
                ps.setPredictionConfidence(parseDoubleSafely(nextLine[11]));
                ps.setPriorityRank(nextLine[12]);
                if (nextLine.length > 13) {
                    ps.setNotes(nextLine[13]);
                }

                predictionScoreRepository.save(ps);
                loadedCount++;
            }
            logger.info("Loaded {} prediction scores from {}", loadedCount, fileName);
        }
    }

    private void loadPyqAnalysis(Resource resource) throws Exception {
        int loadedCount = 0;
        String fileName = resource.getFilename();

        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReader(reader)) {

            String[] header = csvReader.readNext(); // Skip header
            if (header == null) return;

            String[] nextLine;
            while ((nextLine = csvReader.readNext()) != null) {
                if (nextLine.length < 13) continue;

                String pyqId = nextLine[0];
                if (pyqAnalysisRepository.existsByPyqId(pyqId)) {
                    continue; // Skip if exists
                }

                PyqAnalysis pa = new PyqAnalysis();
                pa.setPyqId(pyqId);
                pa.setCommission(nextLine[1]);
                try {
                    pa.setYear(Integer.parseInt(nextLine[2]));
                } catch (NumberFormatException e) {
                    pa.setYear(null); // Handle non-numeric years like "archive"
                }
                pa.setPaper(nextLine[3]);
                pa.setQuestionNumber(nextLine[4]);
                pa.setSubject(nextLine[5]);
                pa.setMicroTopicId(nextLine[6]);
                pa.setQuestionType(nextLine[7]);
                pa.setCognitiveLevel(nextLine[8]);
                pa.setDifficulty(nextLine[9]);
                pa.setRecurrence(nextLine[10]);
                pa.setCaLinked(Boolean.parseBoolean(nextLine[11]));
                
                if (nextLine.length > 12) {
                    pa.setQuestionSummary(nextLine[12]);
                }

                pyqAnalysisRepository.save(pa);
                loadedCount++;
            }
            logger.info("Loaded {} PYQ analyses from {}", loadedCount, fileName);
        }
    }

    private Double parseDoubleSafely(String val) {
        if (val == null || val.trim().isEmpty()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(val.trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
