package com.groupsguru.question;

import com.groupsguru.question.dto.QuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository repository;

    public Page<Question> getAll(Pageable pageable, String subject, String difficulty, String questionType, String sprintId, String search) {
        return repository.findQuestionsWithFilters(subject, difficulty, questionType, sprintId, search, pageable);
    }

    public Question getById(Long id) {
        return repository.findById(id).filter(q -> !q.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
    }

    public Question getByQuestionCode(String questionCode) {
        return repository.findByQuestionCodeAndIsDeletedFalse(questionCode)
                .orElseThrow(() -> new RuntimeException("Question not found with code: " + questionCode));
    }

    public long getCount() {
        return repository.countByIsDeletedFalse();
    }

    public Question create(QuestionRequest request) {
        Optional<Question> existing = repository.findByQuestionCodeAndIsDeletedFalse(request.getQuestionCode());
        if (existing.isPresent()) {
            throw new RuntimeException("Question with code " + request.getQuestionCode() + " already exists.");
        }

        Question q = new Question();
        mapRequestToEntity(request, q);
        return repository.save(q);
    }

    public Question update(Long id, QuestionRequest request) {
        Question q = getById(id);
        mapRequestToEntity(request, q);
        return repository.save(q);
    }

    public void delete(Long id) {
        Question q = getById(id);
        q.setIsDeleted(true);
        repository.save(q);
    }

    private void mapRequestToEntity(QuestionRequest req, Question q) {
        if (req.getQuestionCode() != null) q.setQuestionCode(req.getQuestionCode());
        if (req.getQuestionTextEn() != null) q.setQuestionTextEn(req.getQuestionTextEn());
        if (req.getQuestionTextTe() != null) q.setQuestionTextTe(req.getQuestionTextTe());
        if (req.getOptionAEn() != null) q.setOptionAEn(req.getOptionAEn());
        if (req.getOptionATe() != null) q.setOptionATe(req.getOptionATe());
        if (req.getOptionBEn() != null) q.setOptionBEn(req.getOptionBEn());
        if (req.getOptionBTe() != null) q.setOptionBTe(req.getOptionBTe());
        if (req.getOptionCEn() != null) q.setOptionCEn(req.getOptionCEn());
        if (req.getOptionCTe() != null) q.setOptionCTe(req.getOptionCTe());
        if (req.getOptionDEn() != null) q.setOptionDEn(req.getOptionDEn());
        if (req.getOptionDTe() != null) q.setOptionDTe(req.getOptionDTe());
        if (req.getCorrectOption() != null) q.setCorrectOption(req.getCorrectOption());
        if (req.getExplanationEn() != null) q.setExplanationEn(req.getExplanationEn());
        if (req.getExplanationTe() != null) q.setExplanationTe(req.getExplanationTe());
        if (req.getMicroTopicId() != null) q.setMicroTopicId(req.getMicroTopicId());
        if (req.getSubject() != null) q.setSubject(req.getSubject());
        if (req.getDifficulty() != null) q.setDifficulty(req.getDifficulty());
        if (req.getCognitiveLevel() != null) q.setCognitiveLevel(req.getCognitiveLevel());
        if (req.getQuestionType() != null) q.setQuestionType(req.getQuestionType());
        if (req.getSprintId() != null) q.setSprintId(req.getSprintId());
        if (req.getPenalty() != null) q.setPenalty(req.getPenalty());
    }
}
