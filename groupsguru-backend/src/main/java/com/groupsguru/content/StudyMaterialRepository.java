package com.groupsguru.content;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    Page<StudyMaterial> findByIsDeletedFalse(Pageable pageable);
    
    Page<StudyMaterial> findByIsPublishedTrueAndIsDeletedFalse(Pageable pageable);
    
    List<StudyMaterial> findByIsPublishedTrueAndIsDeletedFalseOrderByDisplayOrderAsc();

    List<StudyMaterial> findByEntityTypeAndEntityIdAndIsDeletedFalseOrderByDisplayOrder(String entityType, Long entityId);

    List<StudyMaterial> findByEntityTypeAndEntityIdAndIsPublishedTrueAndIsDeletedFalseOrderByDisplayOrder(String entityType, Long entityId);

    List<StudyMaterial> findByIsPublishedTrueAndIsDeletedFalseAndStoredFileNameIsNotNullOrderByDisplayOrder();
    
    java.util.Optional<StudyMaterial> findByTitleAndIsDeletedFalse(String title);

    long countByIsDeletedFalse();
}
