package com.groupsguru.exam;

import com.groupsguru.exam.dto.AttemptStartResponse;
import com.groupsguru.exam.dto.SubmitAttemptRequest;
import com.groupsguru.exam.dto.ExamResultDTO;
import com.groupsguru.exam.dto.QuestionResultDTO;
import com.groupsguru.exam.dto.TopicAnalyticsDTO;
import com.groupsguru.question.Question;
import com.groupsguru.question.QuestionRepository;
import com.groupsguru.registry.MicroTopic;
import com.groupsguru.registry.MicroTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamAttemptService {
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionRepository questionRepository;
    private final ExamAttemptRepository examAttemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final MicroTopicRepository microTopicRepository;

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
                .examNameTe(exam.getNameTe())
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

        // Map request answers for easier access (filter out null selectedOption — those are unanswered)
        Map<Long, String> submissionMap = request.getAnswers().stream()
                .filter(a -> a.getSelectedOption() != null)
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

    @Transactional
    public com.groupsguru.exam.dto.PracticeAnswerResponse submitPracticeAnswer(Long examId, com.groupsguru.exam.dto.PracticeAnswerRequest request) {
        Question q = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
        boolean isCorrect = request.getSelectedOption() != null &&
                            request.getSelectedOption().equalsIgnoreCase(q.getCorrectOption());
        return com.groupsguru.exam.dto.PracticeAnswerResponse.builder()
                .isCorrect(isCorrect)
                .correctOption(q.getCorrectOption())
                .explanationEn(q.getExplanationEn())
                .explanationTe(q.getExplanationTe())
                .build();
    }

    public List<ExamAttempt> getMyAttempts(Long userId) {
        return examAttemptRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    public ExamAttempt getAttempt(Long attemptId, Long userId) {
        return examAttemptRepository.findByIdAndUserId(attemptId, userId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));
    }

    public ExamResultDTO getAttemptResult(Long attemptId, Long userId) {
        ExamAttempt attempt = examAttemptRepository.findByIdAndUserId(attemptId, userId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Attempt not yet submitted");
        }

        List<AttemptAnswer> answers = attemptAnswerRepository.findByAttemptId(attemptId);
        List<Long> qIds = answers.stream().map(AttemptAnswer::getQuestionId).toList();
        Map<Long, Question> questionMap = questionRepository.findAllById(qIds).stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        // Get MicroTopics to group by topic name (Question.microTopicId stores MicroTopic business key)
        Set<String> microTopicIds = questionMap.values().stream()
                .map(Question::getMicroTopicId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, MicroTopic> microTopicMap = microTopicRepository.findAllByMicroTopicIdIn(microTopicIds).stream()
                .collect(Collectors.toMap(MicroTopic::getMicroTopicId, mt -> mt));

        List<QuestionResultDTO> questionResults = answers.stream().map(a -> {
            Question q = questionMap.get(a.getQuestionId());
            return QuestionResultDTO.builder()
                    .question(q)
                    .selectedOption(a.getSelectedOption())
                    .isCorrect(a.getIsCorrect())
                    .marks(a.getMarks())
                    .build();
        }).collect(Collectors.toList());

        // Group by topic name
        Map<String, List<QuestionResultDTO>> groupedByTopic = questionResults.stream()
                .collect(Collectors.groupingBy(qr -> {
                    String mtId = qr.getQuestion().getMicroTopicId();
                    MicroTopic mt = microTopicMap.get(mtId);
                    return (mt != null && mt.getTopicName() != null) ? mt.getTopicName() : "General";
                }));

        List<TopicAnalyticsDTO> topicAnalytics = groupedByTopic.entrySet().stream().map(entry -> {
            String topicName = entry.getKey();
            List<QuestionResultDTO> qResults = entry.getValue();
            int total = qResults.size();
            long correct = qResults.stream().filter(qr -> qr.getIsCorrect() != null && qr.getIsCorrect()).count();
            long wrong = qResults.stream().filter(qr -> qr.getIsCorrect() != null && !qr.getIsCorrect()).count();
            long unattempted = qResults.stream().filter(qr -> qr.getIsCorrect() == null).count();
            
            return TopicAnalyticsDTO.builder()
                    .topicName(topicName)
                    .totalQuestions(total)
                    .correctCount((int) correct)
                    .wrongCount((int) wrong)
                    .unattemptedCount((int) unattempted)
                    .hitRate(total > 0 ? (correct * 100.0 / total) : 0.0)
                    .build();
        }).collect(Collectors.toList());

        return ExamResultDTO.builder()
                .attempt(attempt)
                .questions(questionResults)
                .topicAnalytics(topicAnalytics)
                .build();
    }
}
