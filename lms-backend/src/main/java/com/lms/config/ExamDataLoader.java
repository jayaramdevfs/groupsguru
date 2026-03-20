package com.lms.config;

import com.lms.exam.Exam;
import com.lms.exam.ExamRepository;
import com.lms.exam.ExamType;
import com.lms.exam.ExamQuestion;
import com.lms.exam.ExamQuestionRepository;
import com.lms.question.Question;
import com.lms.question.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(10) // Run after QuestionDataLoader
public class ExamDataLoader implements CommandLineRunner {

    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionRepository questionRepository;

    @Override
    public void run(String... args) {
        if (examRepository.count() > 0) {
            return;
        }

        System.out.println("Seeding 2 sample exams...");

        // 1. History — Ancient & Medieval India
        Exam exam1 = new Exam();
        exam1.setName("History — Ancient & Medieval India");
        exam1.setNameTe("చరిత్ర — ప్రాచీన & మధ్యయుగ భారతదేశం");
        exam1.setDescription("Topic-wise test covering ancient and medieval history topics.");
        exam1.setDescriptionTe("ప్రాచీన మరియు మధ్యయుగ చరిత్ర అంశాలను కవర్ చేసే టాపిక్ వారీ పరీక్ష.");
        exam1.setExamType(ExamType.TOPIC_WISE);
        exam1.setSubject("History");
        exam1.setTotalQuestions(25);
        exam1.setDurationMinutes(30);
        examRepository.save(exam1);

        // 2. History — Full Sprint S11.1
        Exam exam2 = new Exam();
        exam2.setName("History — Full Sprint S11.1");
        exam2.setNameTe("చరిత్ర — పూర్తి స్ప్రింట్ S11.1");
        exam2.setDescription("Section-wise test for the entire S11.1 sprint.");
        exam2.setDescriptionTe("మొత్తం S11.1 స్ప్రింట్ కోసం సెక్షన్ వారీ పరీక్ష.");
        exam2.setExamType(ExamType.SECTION_WISE);
        exam2.setSubject("History");
        exam2.setTotalQuestions(50);
        exam2.setDurationMinutes(60);
        examRepository.save(exam2);

        // Assign sample questions if available
        List<Question> historyQuestions = questionRepository.findBySubjectAndIsDeletedFalse("History");
        
        if (!historyQuestions.isEmpty()) {
            // Assign first 25 to exam1
            int count1 = Math.min(25, historyQuestions.size());
            for (int i = 0; i < count1; i++) {
                ExamQuestion eq = new ExamQuestion();
                eq.setExamId(exam1.getId());
                eq.setQuestionId(historyQuestions.get(i).getId());
                eq.setQuestionOrder(i + 1);
                examQuestionRepository.save(eq);
            }
            exam1.setTotalQuestions(count1);
            examRepository.save(exam1);

            // Assign up to 50 to exam2
            int count2 = Math.min(50, historyQuestions.size());
            for (int i = 0; i < count2; i++) {
                ExamQuestion eq = new ExamQuestion();
                eq.setExamId(exam2.getId());
                eq.setQuestionId(historyQuestions.get(i).getId());
                eq.setQuestionOrder(i + 1);
                examQuestionRepository.save(eq);
            }
            exam2.setTotalQuestions(count2);
            examRepository.save(exam2);
            
            System.out.println("Assigned questions to sample exams.");
        }

        System.out.println("Sample exams seeded successfully.");
    }
}
