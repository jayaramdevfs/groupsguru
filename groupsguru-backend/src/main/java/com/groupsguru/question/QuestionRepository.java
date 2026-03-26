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
    
    java.util.List<Question> findByMicroTopicIdAndIsDeletedFalse(String microTopicId);
    
    long countByMicroTopicIdAndIsDeletedFalse(String microTopicId);
    
    long countByIsDeletedFalse();
    
    java.util.List<Question> findByBatchIdAndIsDeletedFalse(Long batchId);
    
    long countByBatchIdAndIsDeletedFalse(Long batchId);

    @Query("SELECT q FROM Question q WHERE q.isDeleted = false " +
           "AND (:subject IS NULL OR q.subject = :subject) " +
           "AND (:difficulty IS NULL OR q.difficulty = :difficulty) " +
           "AND (:questionType IS NULL OR q.questionType = :questionType) " +
           "AND (:sprintId IS NULL OR q.sprintId = :sprintId) " +
           "AND (:search IS NULL OR (LOWER(COALESCE(q.questionTextEn, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "                         LOWER(COALESCE(q.questionTextTe, '')) LIKE LOWER(CONCAT('%', :search, '%'))))")
    Page<Question> findQuestionsWithFilters(
            @Param("subject") String subject,
            @Param("difficulty") String difficulty,
            @Param("questionType") String questionType,
            @Param("sprintId") String sprintId,
            @Param("search") String search,
            Pageable pageable);
}
