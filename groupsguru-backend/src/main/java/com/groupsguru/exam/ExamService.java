package com.groupsguru.exam;

import com.groupsguru.exam.dto.ExamRequest;
import com.groupsguru.exam.dto.AssignQuestionsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    public List<Exam> getAllForStudent() {
        return examRepository.findByIsActiveTrueAndIsDeletedFalse();
    }

    public List<Exam> getAllForAdmin() {
        return examRepository.findByIsDeletedFalse();
    }

    public Exam getById(Long id) {
        return examRepository.findById(id)
                .filter(e -> !e.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + id));
    }

    public Exam create(ExamRequest request) {
        Exam exam = new Exam();
        mapRequestToEntity(request, exam);
        return examRepository.save(exam);
    }

    public Exam update(Long id, ExamRequest request) {
        Exam exam = getById(id);
        mapRequestToEntity(request, exam);
        return examRepository.save(exam);
    }

    public void delete(Long id) {
        Exam exam = getById(id);
        exam.setIsDeleted(true);
        examRepository.save(exam);
    }

    @Transactional
    public void assignQuestions(Long examId, AssignQuestionsRequest request) {
        Exam exam = getById(examId);
        
        // Remove existing assignments
        examQuestionRepository.deleteByExamId(examId);

        // Add new assignments
        List<ExamQuestion> assignments = request.getQuestionIds().stream()
                .map(questionId -> {
                    ExamQuestion eq = new ExamQuestion();
                    eq.setExamId(examId);
                    eq.setQuestionId(questionId);
                    eq.setQuestionOrder(request.getQuestionIds().indexOf(questionId) + 1);
                    return eq;
                }).collect(Collectors.toList());

        examQuestionRepository.saveAll(assignments);
        
        // Update exam's totalQuestions if necessary or requested
        exam.setTotalQuestions(assignments.size());
        examRepository.save(exam);
    }

    public List<Long> getAssignedQuestionIds(Long examId) {
        return examQuestionRepository.findByExamId(examId).stream()
                .map(ExamQuestion::getQuestionId)
                .collect(Collectors.toList());
    }

    private void mapRequestToEntity(ExamRequest req, Exam exam) {
        if (req.getName() != null) exam.setName(req.getName());
        if (req.getNameTe() != null) exam.setNameTe(req.getNameTe());
        if (req.getDescription() != null) exam.setDescription(req.getDescription());
        if (req.getDescriptionTe() != null) exam.setDescriptionTe(req.getDescriptionTe());
        if (req.getExamType() != null) exam.setExamType(req.getExamType());
        if (req.getSubject() != null) exam.setSubject(req.getSubject());
        if (req.getTotalQuestions() != null) exam.setTotalQuestions(req.getTotalQuestions());
        if (req.getDurationMinutes() != null) exam.setDurationMinutes(req.getDurationMinutes());
        if (req.getNegativeMarking() != null) exam.setNegativeMarking(req.getNegativeMarking());
        if (req.getPenaltyPerWrong() != null) exam.setPenaltyPerWrong(req.getPenaltyPerWrong());
        if (req.getMarksPerQuestion() != null) exam.setMarksPerQuestion(req.getMarksPerQuestion());
        if (req.getIsActive() != null) exam.setIsActive(req.getIsActive());
        
        if (req.getCategoryId() != null) exam.setCategoryId(req.getCategoryId());
        if (req.getSubCategoryId() != null) exam.setSubCategoryId(req.getSubCategoryId());
        if (req.getSectionId() != null) exam.setSectionId(req.getSectionId());
        if (req.getTopicId() != null) exam.setTopicId(req.getTopicId());
    }
}
