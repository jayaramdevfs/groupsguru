package com.groupsguru.config;

import com.groupsguru.question.MoodleXmlParser;
import com.groupsguru.question.Question;
import com.groupsguru.question.QuestionRepository;
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
        org.springframework.core.io.support.PathMatchingResourcePatternResolver resolver = new org.springframework.core.io.support.PathMatchingResourcePatternResolver();
        org.springframework.core.io.Resource[] resources = resolver.getResources("classpath*:groupsguru/questions/**/*.xml");
        
        int totalLoaded = 0;
        for (org.springframework.core.io.Resource resource : resources) {
            try (InputStream is = resource.getInputStream()) {
                List<Question> questions = parser.parse(is);
                List<Question> newQuestions = new java.util.ArrayList<>();
                
                for (Question q : questions) {
                    if (q.getQuestionCode() != null && repository.findByQuestionCodeAndIsDeletedFalse(q.getQuestionCode()).isEmpty()) {
                        newQuestions.add(q);
                    }
                }
                
                if (!newQuestions.isEmpty()) {
                    repository.saveAll(newQuestions);
                    totalLoaded += newQuestions.size();
                    log.info("Loaded {} new questions from {}", newQuestions.size(), resource.getFilename());
                } else {
                    log.info("No new questions to load from {}", resource.getFilename());
                }
            } catch (Exception e) {
                log.error("Failed to parse and load Moodle XML: {}", resource.getFilename(), e);
            }
        }
        log.info("Total new questions loaded: {}", totalLoaded);
    }
}
