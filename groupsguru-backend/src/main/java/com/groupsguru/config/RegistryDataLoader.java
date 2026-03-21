package com.groupsguru.config;

import com.groupsguru.registry.MicroTopic;
import com.groupsguru.registry.MicroTopicRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
@Order(1)
public class RegistryDataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(RegistryDataLoader.class);

    @Autowired
    private MicroTopicRepository microTopicRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath*:groupsguru/registry/*.csv");

        for (Resource resource : resources) {
            loadCsvFile(resource);
        }
    }

    private void loadCsvFile(Resource resource) throws Exception {
        int loadedCount = 0;
        String fileName = resource.getFilename();

        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReader(reader)) {

            String[] header = csvReader.readNext(); // Skip header
            if (header == null) return;

            String[] nextLine;
            while ((nextLine = csvReader.readNext()) != null) {
                if (nextLine.length != 16) {
                    throw new RuntimeException("Parse error in file " + fileName + ". Expected 16 columns but got " + nextLine.length + " for microTopicId: " + nextLine[0]);
                }

                String microTopicId = nextLine[0];
                
                Optional<MicroTopic> existing = microTopicRepository.findByMicroTopicIdAndIsDeletedFalse(microTopicId);
                if (existing.isPresent()) {
                    continue; // Skip if exists
                }

                MicroTopic mt = new MicroTopic();
                mt.setMicroTopicId(microTopicId);
                mt.setSubject(nextLine[1]);
                mt.setSectionName(nextLine[2]);
                mt.setTopicName(nextLine[3]);
                mt.setMicroTopicText(nextLine[4]);
                mt.setSyllabusRef(nextLine[5]);
                mt.setGroupApplicability(nextLine[6]);
                mt.setDepthLevel(nextLine[7]);
                mt.setContentType(nextLine[8]);
                mt.setTopicCategory(nextLine[9]);
                mt.setPyqFrequency(nextLine[10]);
                mt.setDifficultyTrend(nextLine[11]);
                mt.setPredictionPriority(nextLine[12]);
                mt.setDataConfidence(nextLine[13].isEmpty() ? "medium" : nextLine[13]); // Ensure non-null dataConfidence
                mt.setPrelimsOrMains(nextLine[14]);
                mt.setPaper(nextLine[15]);

                microTopicRepository.save(mt);
                loadedCount++;
            }
            logger.info("Loaded {} micro-topics from {}", loadedCount, fileName);

        } catch (CsvValidationException e) {
            throw new RuntimeException("CSV Validation error in file " + fileName, e);
        }
    }
}
