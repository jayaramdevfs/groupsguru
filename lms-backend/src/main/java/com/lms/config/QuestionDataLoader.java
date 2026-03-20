package com.lms.config;

import com.lms.question.MoodleXmlParser;
import com.lms.question.Question;
import com.lms.question.QuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

import java.io.InputStream;
import java.util.List;

@Slf4j
@Component
@Order(3) // After Registry and Intelligence loaders
public class QuestionDataLoader implements CommandLineRunner {

    @Autowired
    private QuestionRepository repository;

    @Autowired
    private MoodleXmlParser parser;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() > 0) {
            log.info("Questions already loaded, skipping...");
            return;
        }

        String filePath = "groupsguru/questions/group-1/s11.1-history-ancient-medieval.xml";
        try (InputStream is = new ClassPathResource(filePath).getInputStream()) {
            List<Question> questions = parser.parse(is);
            repository.saveAll(questions);
            log.info("Loaded {} questions from {}", questions.size(), filePath);
        } catch (Exception e) {
            log.error("Failed to parse and load Moodle XML: {}", filePath, e);
            throw e; // Crash on failure
        }
    }
}
