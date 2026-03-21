package com.groupsguru.question;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findByQuestionCodeAndIsDeletedFalse(String questionCode);
    
    java.util.List<Question> findBySubjectAndIsDeletedFalse(String subject);
    
    long countByIsDeletedFalse();

    @Query("SELECT q FROM Question q WHERE q.isDeleted = false " +
           "AND (:subject IS NULL OR q.subject = :subject) " +
           "AND (:difficulty IS NULL OR q.difficulty = :difficulty) " +
           "AND (:questionType IS NULL OR q.questionType = :questionType) " +
           "AND (:sprintId IS NULL OR q.sprintId = :sprintId) " +
           "AND (:search IS NULL OR (LOWER(q.questionTextEn) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(q.questionTextTe) LIKE LOWER(CONCAT('%', :search, '%'))))")
    Page<Question> findQuestionsWithFilters(
            @Param("subject") String subject,
            @Param("difficulty") String difficulty,
            @Param("questionType") String questionType,
            @Param("sprintId") String sprintId,
            @Param("search") String search,
            Pageable pageable);
}
