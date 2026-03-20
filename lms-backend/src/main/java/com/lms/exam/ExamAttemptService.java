package com.lms.exam;

import com.lms.exam.dto.AttemptStartResponse;
import com.lms.exam.dto.SubmitAttemptRequest;
import com.lms.question.Question;
import com.lms.question.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamAttemptService {
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionRepository questionRepository;
    private final ExamAttemptRepository examAttemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;

    @Transactional
    public AttemptStartResponse startAttempt(Long examId, Long userId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        ExamAttempt attempt = new ExamAttempt();
        attempt.setExamId(examId);
        attempt.setUserId(userId);
        attempt.setStatus(AttemptStatus.IN_PROGRESS);
        attempt.setStartedAt(LocalDateTime.now());
        attempt = examAttemptRepository.save(attempt);

        // Fetch questions assigned to this exam
        List<ExamQuestion> examQuestions = examQuestionRepository.findByExamIdOrderByQuestionOrder(examId);
        List<Long> questionIds = examQuestions.stream()
                .map(ExamQuestion::getQuestionId)
                .collect(Collectors.toList());
        
        List<Question> questions = questionRepository.findAllById(questionIds);
        
        // For production, we should map to a DTO and strip correctOption/explanation
        // But for Sprint 11 prototype, we'll return full list as per SPRINTS.md plan.

        return AttemptStartResponse.builder()
                .attemptId(attempt.getId())
                .examId(examId)
                .examName(exam.getName())
                .durationMinutes(exam.getDurationMinutes())
                .questions(questions)
                .build();
    }

    @Transactional
    public ExamAttempt submitAttempt(Long attemptId, Long userId, SubmitAttemptRequest request) {
        ExamAttempt attempt = examAttemptRepository.findByIdAndUserId(attemptId, userId)
                .orElseThrow(() -> new RuntimeException("Attempt not found or unauthorized"));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Attempt already submitted");
        }

        Exam exam = examRepository.findById(attempt.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Load all questions for this exam to compare answers
        List<ExamQuestion> examQuestions = examQuestionRepository.findByExamIdOrderByQuestionOrder(attempt.getExamId());
        List<Long> qIds = examQuestions.stream().map(ExamQuestion::getQuestionId).toList();
        Map<Long, Question> questionMap = questionRepository.findAllById(qIds).stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        List<AttemptAnswer> answers = new ArrayList<>();
        int correctCount = 0;
        int wrongCount = 0;
        int unattemptedCount = 0;
        double totalMarks = 0.0;

        // Map request answers for easier access
        Map<Long, String> submissionMap = request.getAnswers().stream()
                .collect(Collectors.toMap(SubmitAttemptRequest.AnswerDTO::getQuestionId, SubmitAttemptRequest.AnswerDTO::getSelectedOption));

        for (Long questionId : qIds) {
            Question q = questionMap.get(questionId);
            String selected = submissionMap.get(questionId);
            
            AttemptAnswer answer = new AttemptAnswer();
            answer.setAttemptId(attemptId);
            answer.setQuestionId(questionId);
            answer.setSelectedOption(selected);

            if (selected == null || selected.isEmpty()) {
                unattemptedCount++;
                answer.setIsCorrect(null);
                answer.setMarks(0.0);
            } else {
                boolean isCorrect = selected.equalsIgnoreCase(q.getCorrectOption());
                answer.setIsCorrect(isCorrect);
                if (isCorrect) {
                  correctCount++;
                  answer.setMarks(exam.getMarksPerQuestion());
                  totalMarks += exam.getMarksPerQuestion();
                } else {
                  wrongCount++;
                  double penalty = exam.getNegativeMarking() ? exam.getPenaltyPerWrong() : 0.0;
                  answer.setMarks(-penalty);
                  totalMarks -= penalty;
                }
            }
            answers.add(answer);
        }

        attemptAnswerRepository.saveAll(answers);
        
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setCorrectCount(correctCount);
        attempt.setWrongCount(wrongCount);
        attempt.setUnattemptedCount(unattemptedCount);
        attempt.setTotalMarks(totalMarks);
        
        return examAttemptRepository.save(attempt);
    }

    public List<ExamAttempt> getMyAttempts(Long userId) {
        return examAttemptRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    public ExamAttempt getAttempt(Long attemptId, Long userId) {
        return examAttemptRepository.findByIdAndUserId(attemptId, userId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
    }
}
